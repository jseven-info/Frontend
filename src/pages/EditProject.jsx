// src/pages/EditProject.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

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

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    status: 'To Be Announced',
    startDate: '',
    endDate: '',
  });
  const [isStartTBA, setIsStartTBA] = useState(false);
  const [isEndTBA, setIsEndTBA] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`https://backend-9nfg.onrender.com/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const project = res.data;
        setFormData({
          name: project.name || '',
          status: project.status || 'To Be Announced',
          startDate: project.startDate ? formatDateTimeLocal(new Date(project.startDate)) : '',
          endDate: project.endDate ? formatDateTimeLocal(new Date(project.endDate)) : '',
        });
        setIsStartTBA(!project.startDate);
        setIsEndTBA(!project.endDate);
      } catch (err) {
        setError('Failed to load project data');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const nowSeconds = new Date().getSeconds();

      const withSeconds = (dt) => {
        const date = new Date(dt);
        if (isNaN(date.getTime())) return null;
        date.setSeconds(nowSeconds);
        return date.toISOString();
      };

      const cleanedData = {
        name: formData.name.trim(),
        status: formData.status,
        startDate: isStartTBA ? null : withSeconds(formData.startDate),
        endDate: isEndTBA ? null : withSeconds(formData.endDate),
      };

      await axios.put(`https://backend-9nfg.onrender.com/api/projects/${id}`, cleanedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      alert('✅ Project updated successfully');
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Failed to update project:', err);
      alert('Failed to update project. Please check the data and try again.');
    }
  };

  if (loading) return <p className="text-center mt-5">Loading project...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Edit Project</h2>
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

        <button type="submit" className="btn btn-primary">Update Project</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/dashboard')}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProject;
