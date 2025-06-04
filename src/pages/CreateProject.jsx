import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Format as YYYY-MM-DDTHH:00 (no minutes/seconds)
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
    ':00'
  );
};

const CreateProject = () => {
  const now = new Date();
  const roundedNow = new Date(now.setMinutes(0, 0, 0));
  const inOneHour = new Date(roundedNow.getTime() + 60 * 60 * 1000);

  const [formData, setFormData] = useState({
    name: '',
    status: 'To Be Announced',
    startDate: formatDateTimeLocal(roundedNow),
    endDate: formatDateTimeLocal(inOneHour),
  });

  const [isStartTBA, setIsStartTBA] = useState(false);
  const [isEndTBA, setIsEndTBA] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const cleanDate = (dt) => {
        const date = new Date(dt);
        if (isNaN(date.getTime())) return null;
        date.setMinutes(0, 0, 0); // Ensure zeroed minutes/seconds
        return date.toISOString();
      };

      const cleanedData = {
        name: formData.name.trim(),
        status: formData.status,
        startDate: isStartTBA ? null : cleanDate(formData.startDate),
        endDate: isEndTBA ? null : cleanDate(formData.endDate),
      };

      console.log("📤 Sending to API:", cleanedData);

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
            <option value="To Be Announced">To Be Announced</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="startDate" className="form-label">Start Date & Time</label>
          {!isStartTBA ? (
            <input
              type="datetime-local"
              className="form-control"
              id="startDate"
              name="startDate"
              step="3600" // only allow hour selection
              value={formData.startDate}
              onChange={handleChange}
            />
          ) : (
            <input
              type="text"
              className="form-control"
              value="TBA"
              readOnly
            />
          )}
          <div className="form-check mt-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="startTBA"
              checked={isStartTBA}
              onChange={() => setIsStartTBA(!isStartTBA)}
            />
            <label className="form-check-label" htmlFor="startTBA">TBA</label>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="endDate" className="form-label">End Date & Time</label>
          {!isEndTBA ? (
            <input
              type="datetime-local"
              className="form-control"
              id="endDate"
              name="endDate"
              step="3600" // only allow hour selection
              value={formData.endDate}
              onChange={handleChange}
            />
          ) : (
            <input
              type="text"
              className="form-control"
              value="TBA"
              readOnly
            />
          )}
          <div className="form-check mt-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="endTBA"
              checked={isEndTBA}
              onChange={() => setIsEndTBA(!isEndTBA)}
            />
            <label className="form-check-label" htmlFor="endTBA">TBA</label>
          </div>
        </div>

        <button type="submit" className="btn btn-success">Create Project</button>
      </form>
    </div>
  );
};

export default CreateProject;
