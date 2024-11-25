import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './TaskCard.css';

function TaskCard({ id, task, origin }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    data: {
      source: origin, // Pass the origin explicitly ("todolist" or "day-hour")
    },
  });


  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    cursor: 'grab',
    // padding: 0,
    height: '100%', 
    // margin: 0,
    // align: 'center' , 
    // justifyContent: 'center' ,
  };

  return (
    <div
      ref={setNodeRef}
      {...(task ? { style } : {})} // Conditionally add the style
      // style={styleT}
      {...attributes}
      {...listeners}
      className="task-card"
    >
      <h5 className="task-title me-auto mb-auto">{task.title}</h5>
      <span className="task-time ms-auto mt-auto">{task.time_to_complete} hrs</span>
    </div>
  );
}

export default TaskCard;