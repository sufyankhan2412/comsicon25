import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Dashboard from './pages/dashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Team from './pages/Team';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import ProtectedRoute from './ProtectedRoute';
import ManagerHome from './pages/ManagerHome';
import ProjectsList from './pages/ProjectsList';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import ProjectDetails from './pages/ProjectDetails';
import CreateTask from './pages/CreateTask';
import TaskDetails from './pages/TaskDetails';
import TeamMemberDetails from './pages/TeamMemberDetails';
import InviteMember from './pages/InviteMember';

import "./index.css";

const AppRoutes = () => {
  const { user } = React.useContext(AuthContext);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'manager' ? '/manager-dashboard' : '/dashboard'} />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to={user.role === 'manager' ? '/manager-dashboard' : '/dashboard'} />} />

      {/* Regular Dashboard Routes */}
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />}>
        <Route index element={<Home />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="team" element={<Team />} />
        <Route path="chat" element={<Chat />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Manager Dashboard Routes */}
      <Route path="/manager-dashboard" element={user?.role === 'manager' ? <ManagerDashboard /> : <Navigate to="/dashboard" />}>
        <Route index element={<ManagerHome />} />
        <Route path="projects" element={<ProjectsList />} />
        <Route path="projects/create" element={<CreateProject />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="projects/:id/edit" element={<EditProject />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="tasks/create" element={<CreateTask />} />
        <Route path="tasks/:id" element={<TaskDetails />} />
        <Route path="team" element={<Team />} />
        <Route path="team/invite" element={<InviteMember />} />
        <Route path="chat" element={<Chat />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Default Route */}
      <Route path="/" element={<Navigate to={user ? (user.role === 'manager' ? '/manager-dashboard' : '/dashboard') : '/login'} />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;

