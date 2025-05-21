import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateAdmin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://backend-9nfg.onrender.com/api/auth/register', form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Admin registered successfully!');
      setForm({ email: '', password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error registering admin');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3>Create New Admin</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn btn-success">Create Admin</button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAdmin;
