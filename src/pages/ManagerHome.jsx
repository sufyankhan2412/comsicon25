import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ManagerHome = () => {
  const { token, user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState({
    totalProjects: 0,
    projectsByStatus: {
      pending: 0,
      'in-progress': 0,
      completed: 0,
      'on-hold': 0
    },
    recentProjects: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch projects for dashboard stats
        const response = await fetch('http://localhost:5000/api/projects/dashboard', {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

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
        </div>
      </div>
    );
  }

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

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here's an overview of your projects</p>
      </div>

      {/* Project Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Projects</h3>
          <p className="text-3xl font-bold text-gray-800">{dashboardData.totalProjects}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">In Progress</h3>
          <p className="text-3xl font-bold text-blue-600">{dashboardData.projectsByStatus['in-progress']}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Completed</h3>
          <p className="text-3xl font-bold text-green-600">{dashboardData.projectsByStatus.completed}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{dashboardData.projectsByStatus.pending}</p>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Recent Projects</h2>
            <Link
              to="/manager-dashboard/projects"
              className="text-blue-600 hover:text-blue-800"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="divide-y">
          {dashboardData.recentProjects.map(project => (
            <div key={project._id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{project.name}</h3>
                  <p className="text-gray-600 mt-1">{project.description}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <span className="mr-4">
                      Start: {new Date(project.startDate).toLocaleDateString()}
                    </span>
                    <span>
                      End: {new Date(project.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                  {project.status.replace('-', ' ')}
                </span>
              </div>
              <div className="mt-4">
                <Link
                  to={`/manager-dashboard/projects/${project._id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
          {dashboardData.recentProjects.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No projects found. 
              <Link
                to="/manager-dashboard/projects/create"
                className="text-blue-600 hover:text-blue-800 ml-1"
              >
                Create your first project
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerHome;