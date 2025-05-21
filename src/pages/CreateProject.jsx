// src/pages/CreateProject.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Format date to "YYYY-MM-DDTHH:MM" for datetime-local input
const formatDateTimeLocal = (date) => {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes())
  );
};

const CreateProject = () => {
  const now = new Date();
  const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);

  const [formData, setFormData] = useState({
    name: '',
    status: 'Pending',
    startDate: formatDateTimeLocal(now),
    endDate: formatDateTimeLocal(inOneHour),
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      // Reconstruct datetime with seconds from now
      const nowSeconds = new Date().getSeconds();
      const withSeconds = (dt) => {
        const date = new Date(dt);
        date.setSeconds(nowSeconds); // Apply seconds
        return date.toISOString();
      };

      const cleanedData = {
        ...formData,
        startDate: withSeconds(formData.startDate),
        endDate: withSeconds(formData.endDate),
      };

      await axios.post('https://backend-9nfg.onrender.com/api/projects', cleanedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      alert('✅ Project created successfully');
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Error creating project:', err);
      alert('Failed to create project. Please check the data and try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Create New Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Project Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            className="form-select"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="startDate" className="form-label">Start Date & Time</label>
          <input
            type="datetime-local"
            className="form-control"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="endDate" className="form-label">End Date & Time</label>
          <input
            type="datetime-local"
            className="form-control"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-success">Create Project</button>
      </form>
    </div>
  );
};

export default CreateProject;
