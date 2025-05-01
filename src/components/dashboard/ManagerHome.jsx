import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './ManagerHome.css';

const ManagerHome = () => {
  const { user, token } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch projects
        const projectsResponse = await fetch('http://localhost:5000/api/projects', {
          headers: { 'x-auth-token': token }
        });
        
        if (!projectsResponse.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
        
        // Fetch tasks
        const tasksResponse = await fetch('http://localhost:5000/api/tasks', {
          headers: { 'x-auth-token': token }
        });
        
        if (!tasksResponse.ok) {
          throw new Error('Failed to fetch tasks');
        }
        
        const tasksData = await tasksResponse.json();
        setTasks(tasksData);
        
        // Fetch users/team members
        const usersResponse = await fetch('http://localhost:5000/api/users', {
          headers: { 'x-auth-token': token }
        });
        
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const usersData = await usersResponse.json();
        setUsers(usersData.filter(u => u.role === 'team-member'));
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [token]);
  
  // Calculate dashboard stats
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  
  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }
  
  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }
  
  return (
    <div className="manager-home">
      <h1>Welcome, {user.name}</h1>
      <p className="dashboard-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon projects">
            <i className="fas fa-project-diagram"></i>
          </div>
          <div className="stat-details">
            <h3>Projects</h3>
            <p className="stat-value">{projects.length}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon tasks">
            <i className="fas fa-tasks"></i>
          </div>
          <div className="stat-details">
            <h3>Tasks</h3>
            <p className="stat-value">{tasks.length}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon team">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-details">
            <h3>Team Members</h3>
            <p className="stat-value">{users.length}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon completed">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-details">
            <h3>Completed Tasks</h3>
            <p className="stat-value">{completedTasks}</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-card recent-projects">
          <div className="card-header">
            <h2>Recent Projects</h2>
            <Link to="/manager-dashboard/projects" className="view-all">View All</Link>
          </div>
          {projects.length > 0 ? (
            <ul className="project-list">
              {projects.slice(0, 5).map(project => (
                <li key={project._id}>
                  <Link to={`/manager-dashboard/projects/${project._id}`}>
                    <h4>{project.name}</h4>
                    <p>{project.description.substring(0, 60)}...</p>
                    <div className="project-meta">
                      <span className="task-count">
                        <i className="fas fa-tasks"></i> 
                        {tasks.filter(task => task.project === project._id).length} tasks
                      </span>
                      <span className="project-status">
                        {project.status}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p>No projects found</p>
              <Link to="/manager-dashboard/projects/new" className="btn btn-primary">
                <i className="fas fa-plus"></i> Create Project
              </Link>
            </div>
          )}
        </div>
        
        <div className="dashboard-card task-overview">
          <div className="card-header">
            <h2>Task Overview</h2>
            <Link to="/manager-dashboard/tasks" className="view-all">View All</Link>
          </div>
          <div className="task-stats">
            <div className="task-stat">
              <h4>Pending</h4>
              <div className="task-progress">
                <div 
                  className="progress-bar pending" 
                  style={{ width: `${tasks.length > 0 ? (pendingTasks / tasks.length) * 100 : 0}%` }}
                ></div>
              </div>
              <p>{pendingTasks}</p>
            </div>
            <div className="task-stat">
              <h4>In Progress</h4>
              <div className="task-progress">
                <div 
                  className="progress-bar progress" 
                  style={{ width: `${tasks.length > 0 ? (inProgressTasks / tasks.length) * 100 : 0}%` }}
                ></div>
              </div>
              <p>{inProgressTasks}</p>
            </div>
            <div className="task-stat">
              <h4>Completed</h4>
              <div className="task-progress">
                <div 
                  className="progress-bar completed" 
                  style={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
                ></div>
              </div>
              <p>{completedTasks}</p>
            </div>
          </div>
          <div className="recent-tasks">
            <h3>Recent Tasks</h3>
            {tasks.length > 0 ? (
              <ul className="task-list">
                {tasks.slice(0, 5).map(task => (
                  <li key={task._id} className={`task-item ${task.status}`}>
                    <div className="task-info">
                      <h4>{task.title}</h4>
                      <span className={`task-status ${task.status}`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="task-meta">
                      <span className="due-date">
                        <i className="far fa-calendar"></i>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      <span className="assigned-to">
                        <i className="far fa-user"></i>
                        {task.assignedTo && task.assignedTo.name ? task.assignedTo.name : 'Unassigned'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">
                <p>No tasks found</p>
                <Link to="/manager-dashboard/tasks/new" className="btn btn-primary">
                  <i className="fas fa-plus"></i> Create Task
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerHome;