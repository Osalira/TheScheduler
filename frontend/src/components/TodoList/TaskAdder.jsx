import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './TaskAdder.css';

function TaskAdder({ onTaskAdded }) {
  const [newTask, setNewTask] = useState({
    title: '',
    time_to_complete: 1,
    notes: '',
    status: 'not_started',
    reoccurring: false,
    priority: 'not_sure',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleReoccurringChange = (e) => {
    setNewTask({ ...newTask, reoccurring: e.target.value === 'Yes' });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/tasks', newTask);
      onTaskAdded({ ...newTask, id: response.data.id }); // Notify parent of new task
      setNewTask({
        title: '',
        time_to_complete: 1,
        notes: '',
        status: 'not_started',
        reoccurring: false,
        priority: 'not_sure',
      }); // Reset the form
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
    <div className="modal-dialog">
      <div className="modal-content task-modal">
        <div className="modal-header">
          <h5 className="modal-title">Add New Task</h5>
          <button type="button" className="btn-close" aria-label="Close" onClick={() => onTaskAdded(null)}></button>
        </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Time to Complete (Hours)</label>
              <input
                type="number"
                className="form-control"
                name="time_to_complete"
                value={newTask.time_to_complete}
                onChange={handleInputChange}
                min="0.5"
                step="0.5"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="notes"
                value={newTask.notes}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                name="status"
                value={newTask.status}
                onChange={handleInputChange}
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="not_sure">Not Sure</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Reoccurring</label>
              <select
                className="form-control"
                name="reoccurring"
                value={newTask.reoccurring ? 'Yes' : 'No'}
                onChange={handleReoccurringChange}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Priority</label>
              <select
                className="form-control"
                name="priority"
                value={newTask.priority}
                onChange={handleInputChange}
              >
                <option value="not_sure">Not Sure</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
        {/* <button type="button" className="btn btn-secondary" onClick={() => onTaskAdded(null)}>
          Close
        </button> */}
        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
          Save Task
        </button>
      </div>
    </div>
  </div>
</div>
  );
}

TaskAdder.propTypes = {
  onTaskAdded: PropTypes.func.isRequired,
};

export default TaskAdder;
