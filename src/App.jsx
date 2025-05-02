import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/dashboard.jsx';
import ManagerDashboard from './pages/ManagerDashboard';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Chat from './pages/Chat';
import { AuthProvider } from './context/AuthContext.jsx';
import ManagerHome from './pages/ManagerHome';
import ProjectsList from './pages/ProjectsList';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import ProjectDetails from './pages/ProjectDetails';
import Team from './pages/Team';
import Settings from './pages/Settings';
import CreateTask from './pages/CreateTask';
import TeamMemberDetails from './pages/TeamMemberDetails';
import InviteMember from './pages/InviteMember';

import "./index.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<Home />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="chat" element={<Chat />} />
            </Route>

            <Route
              path="/manager-dashboard"
              element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<ManagerHome />} />
              <Route path="projects" element={<ProjectsList />} />
              <Route path="projects/create" element={<CreateProject />} />
              <Route path="projects/:id" element={<ProjectDetails />} />
              <Route path="projects/:id/edit" element={<EditProject />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="tasks/create" element={<CreateTask />} />
              <Route path="team" element={<Team />} />
              <Route path="team/invite" element={<InviteMember />} />
              <Route path="team/:id" element={<TeamMemberDetails />} />
              <Route path="chat" element={<Chat />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

