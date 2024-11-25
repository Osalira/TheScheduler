import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export default function DroppableTimeSlot({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  // Extract `task` from children (assuming there's only one child and it's `TaskCard`)
  let task = null;
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.props.task) {
      task = child.props.task; // Grab the `task` prop
    }
  });

  // Calculate dynamic height if task is found
  const blockHeight = 50; // Height of one block
  const dynamicHeight = task ? task.time_to_complete * blockHeight : 'auto';

  const style = {
    backgroundColor: isOver ? '#e0ffe0' : '#fff', // Highlight on hover
    width: '100%', // Fill the cell width
    height: `${dynamicHeight}px`, // Dynamically set height based on task time
    display: 'flex', // Enable Flexbox for alignment
    justifyContent: 'center', // Center content horizontally
    alignItems: 'center', // Center content vertically
  };

  return (
     <div
      className="droppable-box-slot"
      ref={setNodeRef}
      {...(children ? { style } : {})} // Conditionally add the style
    >
      {children}
    </div>
    
    
  );
}
