// api.js
import axios from 'axios';


export const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      return response.data.map((task) => ({
        id: task.id,
        title: task.title,
        time_to_complete: task.time_to_complete,
        day_of_week: task.day_of_week,
        time_slot: task.time_slot, // Use time_slot
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  };


  
  export const updateTask = async (taskId, dayOfWeek, timeSlot) => {
    try {
      const response = await axios.put(`http://localhost:5000/tasks/${taskId}`, {
        day_of_week: dayOfWeek,
        time_slot: timeSlot, // Use time_slot
      });
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };
  
  export const deleteTask = async (taskId) => {
    try {
        console.log("Task id to deleted .", taskId);
      const response = await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      console.log(`Task ${taskId} deleted successfully.`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting task ${taskId}:`, error);
      throw error;
    }
  };
  
  
  
