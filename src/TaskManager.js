import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskManager.css';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending' });
  const [editingTask, setEditingTask] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/tasks')
      .then((response) => setTasks(response.data))
      .catch((error) => {
        if (!error.response) {
          setFeedback({ message: 'Network error: Unable to reach the server.', type: 'error' });
        } else {
          setFeedback({ message: `Server error: ${error.response.status}`, type: 'error' });
        }
      });
  }, []);

  const handleAddTask = () => {
    axios.post('http://localhost:5000/tasks', newTask)
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask({ title: '', description: '', status: 'pending' });
        setFeedback({ message: 'Task added successfully!', type: 'success' });
        setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
      })
      .catch((error) => {
        setFeedback({ message: 'Error adding task. Please try again.', type: 'error' });
        setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
      });
  };

  const handleUpdateTask = () => {
    axios.put(`http://localhost:5000/tasks/${editingTask.id}`, editingTask)
      .then((response) => {
        const updatedTasks = tasks.map((task) =>
          task.id === editingTask.id ? response.data : task
        );
        setTasks(updatedTasks);
        setEditingTask(null);
        setFeedback({ message: 'Task updated successfully!', type: 'success' });
        setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
      })
      .catch((error) => {
        setFeedback({ message: 'Error updating task. Please try again.', type: 'error' });
        setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
      });
  };

  const handleDeleteTask = (id) => {
    // Show confirmation dialog before deleting the task
    const isConfirmed = window.confirm('Are you sure you want to delete this task?');

    if (isConfirmed) {
      axios.delete(`http://localhost:5000/tasks/${id}`)
        .then(() => {
          const updatedTasks = tasks.filter((task) => task.id !== id);
          setTasks(updatedTasks);
          setFeedback({ message: 'Task deleted successfully!', type: 'success' });
          setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
        })
        .catch((error) => {
          setFeedback({ message: 'Error deleting task. Please try again.', type: 'error' });
          setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
        });
    }
  };

  return (
    <div>
      <h1>Task Manager</h1>

      {/* Show Add Task form only if no task is being edited */}
      {!editingTask && (
        <div>
          <input
            type="text"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <select
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={handleAddTask}>Add Task</button>
        </div>
      )}

      {/* Show Update Task form if a task is being edited */}
      {editingTask && (
        <div>
          <input
            type="text"
            value={editingTask.title}
            onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
          />
          <input
            type="text"
            value={editingTask.description}
            onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
          />
          <select
            value={editingTask.status}
            onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={handleUpdateTask}>Update Task</button>
        </div>
      )}

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <button className="edit-btn" onClick={() => setEditingTask(task)}>Edit</button>
            <button className="delete-btn" onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
      
      {/* Display feedback message */}
      {feedback.message && (
        <div className={`feedback ${feedback.type}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default TaskManager;
