import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Tasks from './Tasks';
import Team from './Team';
import Chat from './Chat';
import Settings from './Settings';
import Home from './Home';

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
    return <div className="flex items-center justify-center min-h-screen">Loading user data...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className={`relative md:fixed md:inset-y-0 md:left-0 md:z-50 md:w-64 w-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Manager Dashboard</h2>
            <div className="flex items-center mt-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
          </div>
          <nav className="p-4 flex-grow">
            <NavLink 
              to="/manager-dashboard" 
              end
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg mb-2 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <i className="fas fa-home mr-3"></i>
              <span>Home</span>
            </NavLink>
            <NavLink 
              to="/manager-dashboard/tasks" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg mb-2 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <i className="fas fa-tasks mr-3"></i>
              <span>Tasks</span>
            </NavLink>
            <NavLink 
              to="/manager-dashboard/team" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg mb-2 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <i className="fas fa-users mr-3"></i>
              <span>Team</span>
            </NavLink>
            <NavLink 
              to="/manager-dashboard/chat" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg mb-2 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <i className="fas fa-comments mr-3"></i>
              <span>Team Chat</span>
            </NavLink>
            <NavLink 
              to="/manager-dashboard/settings" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg mb-2 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <i className="fas fa-cog mr-3"></i>
              <span>Settings</span>
            </NavLink>
          </nav>
          <div className="mt-auto bg-red-50 hover:bg-red-100">
            <button 
              onClick={handleLogout} 
              className="flex items-center w-full p-4 text-red-600"
            >
              <i className="fas fa-sign-out-alt mr-3"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col md:ml-64">
          <header className="bg-white shadow-sm p-4 flex items-center justify-between">
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={toggleMobileSidebar}
            >
              <i className="fas fa-bars"></i>
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Manager Portal</h1>
            <div className="flex items-center">
              <div className="relative">
                <i className="fas fa-bell text-gray-600 cursor-pointer hover:text-gray-800"></i>
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;