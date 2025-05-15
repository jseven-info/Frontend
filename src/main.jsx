// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Deadlines from './pages/Deadlines';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import EditProjects from './pages/EditProjects';  

import ProtectedRoute from './components/ProtectedRoute';
import './index.css';
import CreateAdmin from './pages/CreateAdmin';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/deadlines" element={<Deadlines />} />
        <Route path="/edit-project/:id" element={<EditProject />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/edit-projects" element={<EditProjects />} />
        <Route path="/dashboard" element={<Dashboard />} />
        

        <Route 
          path="/create-admin"
          element={
            <ProtectedRoute>
              <CreateAdmin />
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
          path="/edit-project/:id"
          element={
            <ProtectedRoute>
              <EditProject />
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
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
