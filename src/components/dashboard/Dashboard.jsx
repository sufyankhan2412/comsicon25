import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Home from './Home';
import Tasks from '../tasks/Tasks';
import Chat from '../chat/Chat';
import Settings from '../settings/Settings';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 p-4 z-50 md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-40 w-64 bg-white shadow-lg`}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Team Dashboard</h2>
            <button
              onClick={toggleSidebar}
              className="hidden md:block p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-6 flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        <nav className="mt-6">
          <NavLink 
            to="/dashboard" 
            end
            className={({ isActive }) => 
              `flex items-center px-6 py-3 text-sm font-medium ${
                isActive 
                  ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <i className="fas fa-home mr-3"></i>
            <span>Home</span>
          </NavLink>
          <NavLink 
            to="/dashboard/tasks" 
            className={({ isActive }) => 
              `flex items-center px-6 py-3 text-sm font-medium ${
                isActive 
                  ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <i className="fas fa-tasks mr-3"></i>
            <span>Tasks</span>
          </NavLink>
          <NavLink 
            to="/dashboard/chat" 
            className={({ isActive }) => 
              `flex items-center px-6 py-3 text-sm font-medium ${
                isActive 
                  ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <i className="fas fa-comments mr-3"></i>
            <span>Team Chat</span>
          </NavLink>
          <NavLink 
            to="/dashboard/settings" 
            className={({ isActive }) => 
              `flex items-center px-6 py-3 text-sm font-medium ${
                isActive 
                  ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <i className="fas fa-cog mr-3"></i>
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="absolute bottom-0 w-64 p-6">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Settings Button */}
      <button
        onClick={() => navigate('/dashboard/settings')}
        className="fixed top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 z-50"
      >
        <i className="fas fa-cog text-gray-600"></i>
      </button>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-200 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        <div className="p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-30 md:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;