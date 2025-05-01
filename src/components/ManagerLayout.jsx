import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaProjectDiagram, FaTasks, FaUsers, FaCog, FaSignOutAlt } from 'react-icons/fa';

const ManagerLayout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/manager-dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/manager-dashboard/projects', icon: <FaProjectDiagram />, label: 'Projects' },
    { path: '/manager-dashboard/tasks', icon: <FaTasks />, label: 'Tasks' },
    { path: '/manager-dashboard/team', icon: <FaUsers />, label: 'Team' },
    { path: '/manager-dashboard/settings', icon: <FaCog />, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">CollabSphere</h1>
          <p className="text-sm text-gray-500">Manager Dashboard</p>
        </div>
        
        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 ${
                location.pathname === item.path ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <button className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg">
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ManagerLayout; 