import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Home from './Home';
import Tasks from './Tasks';
import Chat from './Chat';
import Team from './Team';
import Settings from './Settings';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
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
      {/* Sidebar */}
      <aside className="relative w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Team Dashboard</h2>
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
            to="/dashboard/team" 
            className={({ isActive }) => 
              `flex items-center px-6 py-3 text-sm font-medium ${
                isActive 
                  ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <i className="fas fa-users mr-3"></i>
            <span>Team</span>
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
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/team" element={<Team />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;