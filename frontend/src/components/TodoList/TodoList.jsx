import React, { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import TaskAdder from './TaskAdder';
import PLusIcon from '../../icons/PlusICon';

import "./TodoList.css";

function TodoList({ tasks, setTasks }) {
  const { setNodeRef } = useDroppable({ id: 'todolist' });
  const [showModal, setShowModal] = useState(false);

  const handleTaskAdded = (newTask) => {
    if (newTask && newTask.id) {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }
    setShowModal(false);
  };

  return (
    <div ref={setNodeRef} className="col-2 border-end  todo-list-container " >
      <div >
        <h3 className="text-center todo-header">To-Do List</h3>
        <div className="addTaskButton">
      <button
        className="btn addButton d-flex   mt-2"
       
        onClick={() => setShowModal(true)}
      >
        
        <div className='me-auto textInButton'>
        <PLusIcon/>
          Add Task
        </div>
        
      </button>
     
    </div>

        
      </div>
      <div style={{ overflowY: 'auto', height: 'calc(100% - 100px)' }}>
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          <ul className="list-unstyled todo-scrollable">
            {tasks.map((task) => (
              <li className="Size-of-list-card task-card" key={task.id}>
                <TaskCard task={task} id={task.id} origin="todolist" />
              </li>
            ))}
          </ul>
        </SortableContext>
      </div>
      {showModal && <TaskAdder onTaskAdded={handleTaskAdded} />}
    </div>
  );
}

export default TodoList;