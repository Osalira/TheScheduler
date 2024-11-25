import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from '../TodoList/TaskCard';

export default function TimeSlot({ id, task }) {
  
  const { setNodeRef, isOver } = useDroppable({
    id, // Unique ID for the TimeSlot
  });

  const style = {
    backgroundColor: isOver ? '#e0ffe0' : '#fff',
    minHeight: '50px',
    border: '1px dashed #ccc',
    padding: '8px',
  };

  console.log(`Registering TimeSlot with ID: ${id}`);
  console.log(`TimeSlot Task:`, task);

  return (
    <li ref={setNodeRef} style={style}>
      {task && <TaskCard task={task} />}
    </li>
  );
}
