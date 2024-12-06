import React, { useEffect, useState } from 'react';
import { DndContext, 
  KeyboardSensor, 
  PointerSensor, 
  TouchSensor, 
  closestCenter, 
  useSensor, 
  useSensors } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import TodoList from '../components/TodoList/TodoList';
import WeeklyScheduler from '../components/WeeklyScheduler/WeeklyScheduler';
import NavbarItem from '../components/NavbarItem/NavbarItem';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { fetchTasks, updateTask, deleteTask, handleAddTask } from './api';
// import {  fetchTasks, handleAddTask } from './api';

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState({
    // Adjust for 48 half-hour blocks (24 hours * 2)
    Monday: Array(48).fill(null), 
    Tuesday: Array(48).fill(null),
    Wednesday: Array(48).fill(null),
    Thursday: Array(48).fill(null),
    Friday: Array(48).fill(null),
    Saturday: Array(48).fill(null),
    Sunday: Array(48).fill(null),
  });


  // Utility to deep clone the schedule object
  const deepCloneSchedule = (schedule) => {
    const cloned = {};
    for (const day in schedule) {
      cloned[day] = [...schedule[day]]; // Clone each day's array
    }
    return cloned;
  };
  // Fetch tasks from backend
  useEffect(() => {
    const initializeSchedule = async () => {
      try {
        const fetchedTasks = await fetchTasks();
        
        const newSchedule = {
          Monday: Array(48).fill(null),
          Tuesday: Array(48).fill(null),
          Wednesday: Array(48).fill(null),
          Thursday: Array(48).fill(null),
          Friday: Array(48).fill(null),
          Saturday: Array(48).fill(null),
          Sunday: Array(48).fill(null),
        };
  
        fetchedTasks.forEach((task) => {
          if (task.day_of_week && task.time_slot !== null) {
            newSchedule[task.day_of_week][task.time_slot] = task;
          }
        });
        setSchedule(newSchedule);
// here i'm getting filtering element in the 
//todolist, such that only element not in schedule appear on todolist

      const todoListTasks = fetchedTasks.filter(
        (task) => !task.day_of_week && task.time_slot === null
      );
            
      setTasks(todoListTasks);
      } catch (error) {
        console.error('Error initializing schedule:', error);
      }
    };
  
    initializeSchedule();
  }, []);
  

  /**
 * Checks if the drop target ID corresponds to a time slot in WeeklyScheduler.
 * Time slots are identified by the format "day-hour" (e.g., "Monday-3").
 */
const isTimeSlot = (id) => typeof id === "string" && id.includes("-");



// Dealing with card ending up in occupied spot


const shiftTasksDown = (schedule, day, startIndex, taskToPlace) => {
  const updatedSchedule = deepCloneSchedule(schedule);
  const { duration = 1 } = taskToPlace; // Default duration: 1 half-hour block

  // Check if target slots are free
  const targetSlots = updatedSchedule[day].slice(startIndex, startIndex + duration);
  const isCollision = targetSlots.some((slot) => slot !== null);

  if (!isCollision) {
    // Place task directly if no collision
    for (let i = 0; i < duration; i++) {
      updatedSchedule[day][startIndex + i] = taskToPlace;
    }
    return updatedSchedule;
  }

  // Handle collision: shift tasks down
  for (let i = updatedSchedule[day].length - 1; i >= startIndex + duration; i--) {
    updatedSchedule[day][i] = updatedSchedule[day][i - duration];
  }

  // Place the new task in the target slots
  for (let i = 0; i < duration; i++) {
    updatedSchedule[day][startIndex + i] = taskToPlace;
  }

  return updatedSchedule;
};


const addTaskToScheduleWithShifting = (schedule, tasks, taskId, target) => {
  const [targetDay, targetIndex] = target.split("-");
  const draggedTask = tasks.find((task) => task.id === taskId);

  if (!draggedTask) return schedule;

  // Ensure tasks are shifted only if necessary
  return shiftTasksDown(schedule, targetDay, parseInt(targetIndex, 10), draggedTask);
};


const moveTaskInScheduleWithShifting = (schedule, source, target) => {
  const [sourceDay, sourceIndex] = source.split("-");
  const [targetDay, targetIndex] = target.split("-");
  const draggedTask = schedule[sourceDay][parseInt(sourceIndex, 10)];

  if (!draggedTask) return schedule;

  const updatedSchedule = deepCloneSchedule(schedule);
  const { duration = 1 } = draggedTask;

  // Clear the source slots
  for (let i = 0; i < duration; i++) {
    updatedSchedule[sourceDay][parseInt(sourceIndex, 10) + i] = null;
  }

  // Place the task in the target location, shifting tasks only if needed
  return shiftTasksDown(updatedSchedule, targetDay, parseInt(targetIndex, 10), draggedTask);
};



const handleDragEnd = async(event) => {
  const { active, over } = event;

  if (!over || !over.id) return; // Ensure there's a valid drop target

  const taskId = active.id; // ID of the dragged task
  const dropTargetId = over.id; // ID of the drop target
  // Source metadata (e.g., "todolist")
  const sourceId = active.data.current?.source; 

  console.log("Active Task:", taskId);
  console.log("Drop Target ID:", dropTargetId);
  console.log("Source ID:", sourceId);
  

  if (sourceId === 'todolist' && tasks.some((task) => task.id === dropTargetId)) {
    // Reorder tasks within TodoList
    const activeIndex = tasks.findIndex((task) => task.id === taskId);
    const overIndex = tasks.findIndex((task) => task.id === dropTargetId);

    if (activeIndex !== overIndex) {
      setTasks((prevTasks) => arrayMove(prevTasks, activeIndex, overIndex));
    }
  } else if (sourceId === "todolist" && isTimeSlot(dropTargetId)) {
    // Move from TodoList to WeeklyScheduler
    const [targetDay, targetSlot] = dropTargetId.split('-');

    await updateTask(taskId, targetDay, parseInt(targetSlot, 10));

    setSchedule((prevSchedule) =>
      addTaskToScheduleWithShifting(prevSchedule, tasks, taskId, dropTargetId)
    );
    setTasks((prevTasks) => {
      // Filter out the moved task from the TodoList
      return prevTasks.filter((task) => task.id !== taskId);
    });

  } else if (isTimeSlot(sourceId) && isTimeSlot(dropTargetId)) {
    // Move within WeeklyScheduler
    // const [sourceDay, sourceSlot] = sourceId.split('-');

    const [targetDay, targetSlot] = dropTargetId.split('-');

    await updateTask(taskId, targetDay, parseInt(targetSlot, 10));

    setSchedule((prevSchedule) =>
      moveTaskInScheduleWithShifting(prevSchedule, sourceId, dropTargetId)
    );
  } else if (isTimeSlot(sourceId) && !isNaN(dropTargetId)) {
    // Move from WeeklyScheduler to TodoList
    const draggedTask = Object.values(schedule)
      .flat()
      .find((task) => task?.id === taskId);

    if (draggedTask) {
      try {
        // Update task in the backend
        await updateTask(taskId, null, null); // Set day_of_week and time_slot to null

        // Update the state to reflect the changes
        setTasks((prevTasks) => [...prevTasks, draggedTask]); // Add back to TodoList
        setSchedule((prevSchedule) => {
          const updatedSchedule = deepCloneSchedule(prevSchedule);
          Object.keys(updatedSchedule).forEach((day) => {
            updatedSchedule[day] = updatedSchedule[day].map((slot) =>
              slot?.id === taskId ? null : slot
            );
          });
          return updatedSchedule; // Clear the spot in WeeklyScheduler
        });
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  }
};


const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10, // Drag initiates only if pointer moves more than 10 pixels
    },
  }),
  useSensor(TouchSensor),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);

  return (
    <div >
      <div className=' mb-4'>
      <NavbarItem/>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="homepage-container content row ">
          <div className="row container-fluid">
            <TodoList tasks={tasks}
             setTasks={setTasks} 
             
             deleteTask={deleteTask}
             handleAddTask={handleAddTask}
             />
            
            <WeeklyScheduler schedule={schedule} setSchedule={setSchedule} tasks={tasks} />
            
            
          </div>
        </div>
      </DndContext>
    </div> 
  );
}

export default HomePage;