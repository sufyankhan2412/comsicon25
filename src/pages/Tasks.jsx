// pages/dashboard/Tasks.js
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import "./Dashboard.css"

const Tasks = () => {
  const { token, user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // New task form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignedTo: '',
    dueDate: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  
  // Edit task state
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch tasks
        const tasksRes = await fetch('http://localhost:5000/api/tasks', {
          headers: {
            'x-auth-token': token
          }
        });
        
        if (!tasksRes.ok) {
          throw new Error('Failed to fetch tasks');
        }
        
        const tasksData = await tasksRes.json();
        setTasks(tasksData);
        setFilteredTasks(tasksData);
        
        // Fetch users for assigning tasks
        const usersRes = await fetch('http://localhost:5000/api/users', {
          headers: {
            'x-auth-token': token
          }
        });
        
        if (!usersRes.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const usersData = await usersRes.json();
        setUsers(usersData);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load tasks. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [token]);
  
  // Filter tasks when filter or search changes
  useEffect(() => {
    let result = [...tasks];
    
    // Apply status filter
    if (filter !== 'all') {
      result = result.filter(task => task.status === filter);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(term) || 
        task.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredTasks(result);
  }, [filter, searchTerm, tasks]);
  
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      assignedTo: '',
      dueDate: ''
    });
    setEditMode(false);
    setEditTaskId(null);
  };
  
  const handleAddTask = async (e) => {
    e.preventDefault();
    
    try {
      setFormLoading(true);
      
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      
      const newTask = await response.json();
      
      // Update tasks list
      setTasks([newTask, ...tasks]);
      
      // Reset form and hide it
      resetForm();
      setShowForm(false);
      
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleEditTask = async (e) => {
    e.preventDefault();
    
    try {
      setFormLoading(true);
      
      const response = await fetch(`http://localhost:5000/api/tasks/${editTaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      const updatedTask = await response.json();
      
      // Update tasks list
      setTasks(tasks.map(task => 
        task._id === editTaskId ? updatedTask : task
      ));
      
      // Reset form and hide it
      resetForm();
      setShowForm(false);
      
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      // Remove task from list
      setTasks(tasks.filter(task => task._id !== taskId));
      
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };
  
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const taskToUpdate = tasks.find(task => task._id === taskId);
      
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ ...taskToUpdate, status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
      
      const updatedTask = await response.json();
      
      // Update tasks list
      setTasks(tasks.map(task => 
        task._id === taskId ? updatedTask : task
      ));
      
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status. Please try again.');
    }
  };
  
  const editTask = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      assignedTo: task.assignedTo._id,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
    setEditMode(true);
    setEditTaskId(task._id);
    setShowForm(true);
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-progress';
      default:
        return 'status-pending';
    }
  };
  
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      default:
        return 'priority-low';
    }
  };
  
  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }
  
  return (
    <div className="tasks-container">
      <header className="tasks-header">
        <h1>Tasks Management</h1>
        <button 
          className="btn-add-task" 
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Cancel' : 'Add New Task'}
        </button>
      </header>
      
      {error && <div className="error-message">{error}</div>}
      
      {showForm && (
        <div className="task-form-container">
          <form onSubmit={editMode ? handleEditTask : handleAddTask} className="task-form">
            <h2>{editMode ? 'Edit Task' : 'Add New Task'}</h2>
            
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleFormChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="assignedTo">Assign To</label>
                <select
                  id="assignedTo"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Team Member</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleFormChange}
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-submit"
                disabled={formLoading}
              >
                {formLoading ? 'Saving...' : (editMode ? 'Update Task' : 'Add Task')}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="tasks-filters">
        <div className="filter-controls">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setFilter('in-progress')}
          >
            In Progress
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      {filteredTasks.length === 0 ? (
        <div className="no-tasks">
          <p>No tasks found. {filter !== 'all' && 'Try changing your filter.'}</p>
        </div>
      ) : (
        <div className="tasks-list">
          {filteredTasks.map(task => (
            <div className="task-card" key={task._id}>
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <div className="task-actions">
                  {user._id === task.createdBy._id && (
                    <>
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => editTask(task)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <p className="task-description">{task.description}</p>
              
              <div className="task-meta">
                <div className="meta-item">
                  <span className="meta-label">Assigned to:</span>
                  <span className="meta-value">{task.assignedTo.name}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Priority:</span>
                  <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                {task.dueDate && (
                  <div className="meta-item">
                    <span className="meta-label">Due date:</span>
                    <span className="meta-value">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="task-status-section">
                <span className="meta-label">Status:</span>
                <div className="status-controls">
                  <button 
                    className={`status-btn ${task.status === 'pending' ? getStatusClass('pending') : ''}`}
                    onClick={() => handleStatusChange(task._id, 'pending')}
                  >
                    Pending
                  </button>
                  <button 
                    className={`status-btn ${task.status === 'in-progress' ? getStatusClass('in-progress') : ''}`}
                    onClick={() => handleStatusChange(task._id, 'in-progress')}
                  >
                    In Progress
                  </button>
                  <button 
                    className={`status-btn ${task.status === 'completed' ? getStatusClass('completed') : ''}`}
                    onClick={() => handleStatusChange(task._id, 'completed')}
                  >
                    Completed
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;