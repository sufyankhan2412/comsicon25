import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Home from './Home';
import Tasks from './Tasks';
import Chat from './Chat';

import "./Dashboard.css"

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (!user) {
    return <div className="loading">Loading user data...</div>;
  }
  
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Team Dashboard</h2>
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
            to="/dashboard" 
            end
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <i className="fas fa-home"></i>
            <span>Home</span>
          </NavLink>
          <NavLink 
            to="/dashboard/tasks" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <i className="fas fa-tasks"></i>
            <span>Tasks</span>
          </NavLink>
          <NavLink 
            to="/dashboard/chat" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <i className="fas fa-comments"></i>
            <span>Team Chat</span>
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-logout">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;