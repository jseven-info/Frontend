import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState({
    name: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProject(res.data);
    } catch (err) {
      console.error('Failed to fetch project', err);
      alert('Error loading project');
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/projects/${id}`, project, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Project updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Update failed', err);
      alert('Error updating project');
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-5">
      <h3>Edit Project</h3>
      {loading ? (
        <p>Loading project details...</p>
      ) : (
        <form onSubmit={updateProject} className="card p-4 shadow-sm">
          <div className="mb-3">
            <label className="form-label">Project Name</label>
            <input
              type="text"
              name="name"
              value={project.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={project.status}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select status</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={project.startDate?.substring(0, 10) || ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">End Date</label>
            <input
              type="date"
              name="endDate"
              value={project.endDate?.substring(0, 10) || ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-primary">Update Project</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/dashboard')}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default EditProject;
