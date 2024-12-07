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
// import { useApiClient } from "../ApiProvider";
import { useApiClient } from './ApiProvider';
import { fetchTasks, updateTask, deleteTask, fetchUsername, handleAddTask } from './api';


function HomePage() {
  const [tasks, setTasks] = useState([]);
  const apiClient = useApiClient(); // Access apiClient from context
  const [username, setUsername] = useState("");

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
        const fetchedTasks = await fetchTasks(apiClient);
       
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
          if (task.day_of_week && task.time_slot !== "") {
            newSchedule[task.day_of_week][task.time_slot] = task;
          }
        });
        setSchedule(newSchedule);
// here i'm filtering element in the 
//todolist, such that only element not in schedule appear on todolist

      const todoListTasks = fetchedTasks.filter(
        (task) => task.day_of_week === "" && task.time_slot === ""
      );

      setTasks(todoListTasks);
      
      } catch (error) {
        console.error('Error initializing schedule:', error);
      }
    };
    const getUsername = async () => {
      try {
        const fetchedUsername = await fetchUsername(apiClient);
        console.log("fetched", fetchedUsername);
        setUsername(fetchedUsername);
        
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };
    getUsername();
    initializeSchedule();
  }, [apiClient]);
  

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


const addTaskToScheduleWithShifting = (schedule, tasks, taskId, dropTargetId) => {
  const [targetDay, targetSlot] = dropTargetId.split("-");
  const taskToMove = tasks.find((task) => task.id === taskId);

  if (!taskToMove) return schedule;

  const updatedSchedule = deepCloneSchedule(schedule);
  updatedSchedule[targetDay][parseInt(targetSlot, 10)] = {
    ...taskToMove,
    day_of_week: targetDay,
    time_slot: targetSlot,
  };

  return updatedSchedule;
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

  // const taskId = active.id; // ID of the dragged task
  // const dropTargetId = over.id; // ID of the drop target
  // Source metadata (e.g., "todolist")
  // const sourceId = active.data.current?.source; 
  const taskId = active.id; // ID of the dragged task
  const sourceId = active.data.current?.source || ""; // Fallback to empty string
  const dropTargetId = over.id; // ID of the drop target

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

    await updateTask(apiClient, taskId, targetDay, parseInt(targetSlot, 10));

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

    await updateTask(apiClient,taskId, targetDay, parseInt(targetSlot, 10));
    
    
    setSchedule((prevSchedule) =>
      moveTaskInScheduleWithShifting(prevSchedule, sourceId, dropTargetId)
    );
  }  else if (isTimeSlot(sourceId) && (!dropTargetId || dropTargetId === "todolist")) {
    // Move from WeeklyScheduler to TodoList
    const draggedTask = Object.values(schedule)
      .flat()
      .find((task) => task?.id === taskId);
  
    if (draggedTask) {
      try {
        // Update task in the backend
        await updateTask(apiClient, taskId, "", ""); // Set day_of_week and time_slot to empty strings
  
        // Update the state to reflect the changes
        setTasks((prevTasks) => {
          // Append the dragged task to the TodoList, even if it's currently empty
          return [
            ...prevTasks,
            { ...draggedTask, day_of_week: "", time_slot: "" }, // Ensure proper structure
          ];
        });
  
        // Clear the dragged task from the WeeklyScheduler
        setSchedule((prevSchedule) => {
          const updatedSchedule = deepCloneSchedule(prevSchedule);
          Object.keys(updatedSchedule).forEach((day) => {
            updatedSchedule[day] = updatedSchedule[day].map((slot) =>
              slot?.id === taskId ? null : slot
            );
          });
          return updatedSchedule;
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
      distance: 5, // Drag initiates only if pointer moves more than 10 pixels
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
      <NavbarItem username={username}/>
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