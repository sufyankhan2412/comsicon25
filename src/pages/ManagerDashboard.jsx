import React, { useContext, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ManagerLayout from '../components/ManagerLayout';

const ManagerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Verify user is a manager
    if (user && user.role !== 'manager') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading user data...</div>;
  }

  return (
    <ManagerLayout>
      <Outlet />
    </ManagerLayout>
  );
};

export default ManagerDashboard;