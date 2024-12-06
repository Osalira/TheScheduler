// api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const fetchTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/tasks`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        "Content-Type": "application/json",

      },
    });
    console.log("Tasks fetched:", response.data);
    return response.data.map((task) => ({
      id: task.id,
      title: task.title,
      time_to_complete: task.time_to_complete,
      day_of_week: task.day_of_week,
      time_slot: task.time_slot,
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error.response?.data || error);
    throw error;
  }
};


export const updateTask = async (taskId, dayOfWeek, timeSlot) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/tasks/${taskId}`,
      { day_of_week: dayOfWeek, time_slot: timeSlot },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    console.log(`Task ${taskId} deleted successfully.`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting task ${taskId}:`, error);
    throw error;
  }
};



export const handleAddTask = async (taskData) => {
 
  
  console.log("the data to send", taskData)

  try {
    const token = localStorage.getItem('authToken');
    // console.error('token:', token);
    if (!token) {
      throw new Error('Authentication token missing');
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/addtasks`,
        taskData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        
      }
    );

    console.log('Task successfully added:', response.data.task);
    return response.data.task; // Return the created task
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

