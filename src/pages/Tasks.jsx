// pages/dashboard/Tasks.js
import { useState, useEffect } from 'react';

const Tasks = () => {
  const mockTasks = [
    {
      _id: '1',
      title: 'Frontend Development',
      description: 'Implement the user dashboard interface with React and Tailwind CSS',
      status: 'pending',
      priority: 'high',
      assignedTo: { _id: '1', name: 'Ashar Malik', email: 'asharmalik6231@gmail.com' },
      dueDate: '2024-03-20',
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      title: 'API Integration',
      description: 'Connect frontend components with backend API endpoints',
      status: 'in-progress',
      priority: 'high',
      assignedTo: { _id: '1', name: 'Ashar Malik', email: 'asharmalik6231@gmail.com' },
      dueDate: '2024-03-25',
      createdAt: new Date().toISOString()
    },
    {
      _id: '3',
      title: 'User Authentication',
      description: 'Implement JWT-based authentication system',
      status: 'completed',
      priority: 'medium',
      assignedTo: { _id: '1', name: 'Ashar Malik', email: 'asharmalik6231@gmail.com' },
      dueDate: '2024-03-15',
      createdAt: new Date().toISOString()
    }
  ];

  const [tasks, setTasks] = useState(mockTasks);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter tasks when filter or search changes
  useEffect(() => {
    // First filter by user's email
    let result = tasks.filter(task => 
      task.assignedTo.email === 'asharmalik6231@gmail.com'
    );
    
    // Then apply status filter
    if (filter !== 'all') {
      result = result.filter(task => task.status === filter);
    }
    
    // Then apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(term) || 
        task.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredTasks(result);
  }, [filter, searchTerm, tasks]);

  const handleStatusChange = (taskId, newStatus) => {
    try {
      // Update the tasks state with the new status
      const updatedTasks = tasks.map(task =>
        task._id === taskId ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status. Please try again.');
    }
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Loading tasks...</div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">My Tasks</h1>
      </div>

      <div className="mb-6 flex space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="grid gap-6">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tasks found. {searchTerm ? 'Try a different search term.' : 'You have no assigned tasks at the moment.'}
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task._id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusClass(task.status)}`}>
                  {task.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${getPriorityClass(task.priority)}`}>
                  {task.priority}
                </span>
                {task.dueDate && (
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;