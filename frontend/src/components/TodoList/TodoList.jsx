import React, { useState } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import TaskAdder from "./TaskAdder";
import PLusIcon from "../../icons/PlusICon";
// import { fetchTasks } from "../../pages/api";

import "./TodoList.css";

function TodoList({ tasks, setTasks, deleteTask, handleAddTask }) {

  // console.log("tasks passed from homepage", tasks);
  const { setNodeRef } = useDroppable({ id: "todolist" });
  const [showModal, setShowModal] = useState(false);

  const handleTaskAdded = (newTask) => {
    if (newTask && newTask.id) {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }
    setShowModal(false);
  };

  return (
    <div ref={setNodeRef} className="col-2 border-end todo-list-container">
      <div>
        <h3 className="text-center todo-header">To-Do List</h3>
        <div className="addTaskButton">
          <button
            className="btn addButton d-flex mt-2"
            onClick={() => setShowModal(true)}
          >
            <div className="me-auto textInButton">
              <PLusIcon />
              Add Task
            </div>
          </button>
        </div>
      </div>
      <div className="listWithSortableItems" >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="list-unstyled todo-scrollable">
            {tasks.map((task, index) => (
              <li
                className="Size-of-list-card task-card"
                key={`${task.id}-${index}`}
              >
                {/* Pass handleDelete to TaskCard */}
                <TaskCard
                  task={task}
                  id={task.id}
                  origin="todolist"
                  tasks={tasks}
                  setTasks={setTasks}
                  deleteTask={deleteTask} // Pass the delete function
                />
              </li>
            ))}
          </ul>
        </SortableContext>
      </div>
      {showModal && <TaskAdder onTaskAdded={handleTaskAdded} handleAddTask={handleAddTask}/>}
    </div>
  );
}

export default TodoList;
