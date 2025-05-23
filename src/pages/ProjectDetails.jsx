import React, { useState, useContext, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
          headers: {
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }

        const data = await response.json();
        setProject(data);
        setStatus(data.status);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, token]);

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) {
        throw new Error('Failed to update project status');
      }
      setStatus(newStatus);
      setProject(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    setDeleting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      navigate('/manager-dashboard/projects');
    } catch (err) {
      setError('Failed to delete project');
    } finally {
      setDeleting(false);
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
            {error}
          </div>
        </div>
    );
  }

  if (!project) {
    return (
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded relative" role="alert">
            Project not found
          </div>
        </div>
    );
  }

  return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <p className="mt-2 text-sm text-gray-600">Project Details</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/manager-dashboard/projects/${id}/edit`}
                  className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                >
                  Edit Project
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 border border-red-300 rounded-lg shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
                <Link
                  to="/manager-dashboard/projects"
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                >
                  Back to Projects
                </Link>
              </div>
            </div>
          </div>

          <div className="px-8 py-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Project Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="mt-2 text-sm text-gray-900">{project.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    {user?.role === 'manager' ? (
                      <select
                        value={status}
                        onChange={e => handleStatusChange(e.target.value)}
                        className={`mt-2 block w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${getStatusColor(status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="on-hold">On Hold</option>
                      </select>
                    ) : (
                      <span className={`mt-2 inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {project.status.replace('-', ' ')}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Start Date</p>
                    <p className="mt-2 text-sm text-gray-900">
                      {new Date(project.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">End Date</p>
                    <p className="mt-2 text-sm text-gray-900">
                      {new Date(project.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created By</p>
                    <p className="mt-2 text-sm text-gray-900">
                      {project.manager?.name || 'Unknown Manager'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created At</p>
                    <p className="mt-2 text-sm text-gray-900">
                      {new Date(project.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Team Members</h3>
                {project.teamMembers && project.teamMembers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {project.teamMembers.map(member => (
                      <div
                        key={member._id}
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-sm">
                                {member.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {member.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {member.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No team members assigned to this project.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProjectDetails; 