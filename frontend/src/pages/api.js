// api.js

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

export const fetchTasks = async (apiClient) => {
  try {
    const response = await apiClient.get("/api/tasks");
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

export const fetchUsername = async (apiClient) => {
  try {
    const response = await apiClient.get("/api/current_user");
    return response.data.username; // Adjust this based on your API response structure
  } catch (error) {
    console.error("Error fetching username:", error.response?.data || error);
    throw error;
  }
};


export const updateTask = async (apiClient,taskId, dayOfWeek, timeSlot) => {
  try {
    const response = await apiClient.put(
      `/api/tasks/${taskId}`,
      { day_of_week: dayOfWeek, time_slot: timeSlot }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (apiClient, taskId) => {
  try {
    const response = await apiClient.delete(`/api/tasks/${taskId}`);
    console.log(`Task ${taskId} deleted successfully.`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting task ${taskId}:`, error);
    throw error;
  }
};



export const handleAddTask = async (apiClient, taskData) => {
  try {
    const response = await apiClient.post("/api/addtasks", taskData);
    console.log("Task successfully added:", response.data.task);
    return response.data.task;
  } catch (error) {
    console.error("Error adding task:", error.response?.data || error);
    throw error;
  }
};


