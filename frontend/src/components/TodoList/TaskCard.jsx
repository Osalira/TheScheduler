import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DeleteIcon from "../../icons/DeleteIcon";
import "./TaskCard.css";

function TaskCard({ id, task, setTasks, origin, deleteTask }) {
  // console.log("deleteTask prop in TaskCard:", deleteTask);
  // console.log("id card passed from todolist", id);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      data: {
        source: origin,
      },
    });

  const [mouseIsOver, setMouseIsOver] = useState(false);

  const handleMouseEnter = () => setMouseIsOver(true);
  const handleMouseLeave = () => setMouseIsOver(false);

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    cursor: "grab",
    height: "100%",
  };

  
  const handleDelete = async () => {
    console.log("Deleting task with ID:", task.id);
    if (deleteTask) {
      try {
        await deleteTask(task.id); // Call the API to delete the task
        setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id)); // Update tasks state
        console.log(`Task ${task.id} removed successfully from the list.`);
      } catch (error) {
        console.error(`Error deleting task ${task.id}:`, error);
      }
    } else {
      console.warn("deleteTask function is not provided.");
    }
  };
  

  return (
    <div
      ref={setNodeRef}
      style={task ? style : {}}
      {...attributes}
      {...listeners}
      className="task-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <h5 className="task-title me-auto mb-auto">{task.title}</h5>
      <span className="task-time ms-auto mt-auto">{task.time_to_complete} hrs</span>

      {/* Conditionally render the delete button */}
      {origin === "todolist" && mouseIsOver && (
        <button
        data-no-dnd="true" // Mark this element to exclude from drag-and-drop
        onMouseDown={(e) => e.stopPropagation()}
        className="delete-icon"
        onClick={() => {
          //e.stopPropagation();  //Prevents triggering other events
          console.log("Delete button clicked for task:", task.id);
          handleDelete();
        }}
        title="Delete Task"
      >
        <DeleteIcon />
      </button>    
      )}
    </div>
  );
}

export default TaskCard;
