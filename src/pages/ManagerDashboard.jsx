import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ManagerHome from './ManagerHome';
import ProjectsList from './ProjectsList';
import ProjectDetail from './ProjectDetail';
import CreateProject from './CreateProject';
import EditProject from './EditProject';
import TasksList from './TasksList';
import CreateTask from '.CreateTask';
import EditTask from './EditTask';
import TeamMembers from './TeamMembers';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  useEffect(() => {
    // Verify user is a manager
    if (user && user.role !== 'manager') {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  
  if (!user) {
    return <div className="loading">Loading user data...</div>;
  }
  
  return (
    <div className="manager-dashboard-container">
      <aside className={`manager-sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Manager Dashboard</h2>
          <div className="user-info">
            <div className="avatar">{user.name.charAt(0)}</div>
            <div className="user-details">
              <p className="user-name">{user.name}</p>
              <p className="user-role">{user.role}</p>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <NavLink 
            to="/manager-dashboard" 
            end
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <i className="fas fa-home"></i>
            <span>Home</span>
          </NavLink>
          <NavLink 
            to="/manager-dashboard/projects" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <i className="fas fa-project-diagram"></i>
            <span>Projects</span>
          </NavLink>
          <NavLink 
            to="/manager-dashboard/tasks" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <i className="fas fa-tasks"></i>
            <span>Tasks</span>
          </NavLink>
          <NavLink 
            to="/manager-dashboard/team" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <i className="fas fa-users"></i>
            <span>Team Members</span>
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-logout">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      <div className="manager-content-wrapper">
        <header className="manager-header">
          <button className="mobile-menu-toggle" onClick={toggleMobileSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          <h1>Manager Portal</h1>
          <div className="header-actions">
            <div className="notifications">
              <i className="fas fa-bell"></i>
            </div>
          </div>
        </header>
        
        <main className="manager-content">
          <Routes>
            <Route path="/" element={<ManagerHome />} />
            <Route path="/projects" element={<ProjectsList />} />
            <Route path="/projects/new" element={<CreateProject />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/projects/:id/edit" element={<EditProject />} />
            <Route path="/tasks" element={<TasksList />} />
            <Route path="/tasks/new" element={<CreateTask />} />
            <Route path="/tasks/:id/edit" element={<EditTask />} />
            <Route path="/team" element={<TeamMembers />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;