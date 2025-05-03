import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Helper to handle nav link clicks
  const handleNav = (hash) => (e) => {
    if (location.pathname !== '/') {
      e.preventDefault();
      navigate('/' + hash);
    }
    // else, let anchor work as normal
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">CollabSphere</span>
          </div>
          {/* Nav + Auth Buttons */}
          <div className="flex items-center">
            <nav className="flex items-center space-x-8">
              <a href="#features" onClick={handleNav('#features')} className="text-gray-600 hover:text-primary-600">Features</a>
              <a href="#integrations" onClick={handleNav('#integrations')} className="text-gray-600 hover:text-primary-600">Integrations</a>
              <a href="#pricing" onClick={handleNav('#pricing')} className="text-gray-600 hover:text-primary-600">Pricing</a>
              <a href="#security" onClick={handleNav('#security')} className="text-gray-600 hover:text-primary-600">Security</a>
            </nav>
            <div className="flex items-center space-x-2 ml-6">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 