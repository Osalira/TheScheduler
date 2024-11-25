// api.js
import axios from 'axios';

export const fetchTasks = async () => {
  try {
    const response = await axios.get('http://localhost:5000/tasks');
    return response.data.map((task) => ({
      id: task.id,
      title: task.title,
      time_to_complete: task.time_to_complete,
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};
