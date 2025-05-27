// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home'; // Home page
import Dashboard from './pages/Dashboard';
import Deadlines from './pages/Deadlines';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import EditProjects from './pages/EditProjects';
import CreateAdmin from './pages/CreateAdmin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/deadlines"
        element={
          <ProtectedRoute>
            <Deadlines />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-project"
        element={
          <ProtectedRoute>
            <CreateProject />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-projects"
        element={
          <ProtectedRoute>
            <EditProjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-project/:id"
        element={
          <ProtectedRoute>
            <EditProject />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-admin"
        element={
          <ProtectedRoute>
            <CreateAdmin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
