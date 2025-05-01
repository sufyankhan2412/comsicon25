import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProjectsList = () => {
  const { token, user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Debug logs
        console.log('Auth state:', { token, user });
        console.log('Making request to:', 'http://localhost:5000/api/projects');
        
        const response = await fetch('http://localhost:5000/api/projects', {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorData = await response.json().catch(e => ({ msg: 'Could not parse error response' }));
          console.error('Error response:', errorData);
          throw new Error(errorData.msg || `Server responded with status ${response.status}`);
        }

        const data = await response.json().catch(e => {
          console.error('Error parsing response:', e);
          throw new Error('Failed to parse server response');
        });
        
        console.log('Projects data:', data);
        setProjects(data);
        setLoading(false);
      } catch (err) {
        console.error('Full error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        });
        setError(err.message || 'Failed to fetch projects. Please try again later.');
        setLoading(false);
      }
    };

    if (!token) {
      console.error('No authentication token found');
      setError('Authentication token not found. Please log in again.');
      setLoading(false);
      return;
    }

    fetchProjects();
  }, [token, user]);

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
          method: 'DELETE',
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Failed to delete project');
        }

        setProjects(projects.filter(project => project._id !== projectId));
      } catch (err) {
        console.error('Error deleting project:', err);
        alert('Failed to delete project: ' + err.message);
      }
    }
  };

  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'status') {
        return sortDirection === 'asc' 
          ? a.status.localeCompare(b.status) 
          : b.status.localeCompare(a.status);
      } else {
        return sortDirection === 'asc' 
          ? new Date(a[sortBy]) - new Date(b[sortBy]) 
          : new Date(b[sortBy]) - new Date(a[sortBy]);
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <div className="mt-2">
            <button
              onClick={() => window.location.reload()}
              className="text-red-600 hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <Link
          to="/manager-dashboard/projects/create"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create New Project
        </Link>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On Hold</option>
        </select>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No projects found</p>
          <Link
            to="/manager-dashboard/projects/create"
            className="text-blue-600 hover:text-blue-800"
          >
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div key={project._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{project.name}</h2>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                  {project.status.replace('-', ' ')}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{project.description}</p>
              
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <div>
                  <span className="font-medium">Start Date:</span>{' '}
                  {new Date(project.startDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">End Date:</span>{' '}
                  {new Date(project.endDate).toLocaleDateString()}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-2">
                    {project.manager?.name?.charAt(0) || 'M'}
                  </div>
                  <span className="text-sm text-gray-600">
                    {project.manager?.name || 'Manager'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/manager-dashboard/projects/${project._id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View
                  </Link>
                  <Link
                    to={`/manager-dashboard/projects/${project._id}/edit`}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
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

export default ProjectsList;