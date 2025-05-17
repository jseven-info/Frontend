import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/projects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Failed to delete project', err);
      alert('Error deleting project');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <header className="bg-dark text-white p-3">
        <div className="container d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Admin Dashboard</h3>
          <button
            className="btn btn-outline-light"
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="container mt-5">
        {loading ? (
          <p>Loading projects...</p>
        ) : (
          <div className="row g-4">
            {/* Project Summary */}
            <div className="col-md-4">
              <div className="card border-primary shadow h-100">
                <div className="card-body">
                  <h5 className="card-title text-primary">Project Summary</h5>
                  <p>Total Projects: <strong>{projects.length}</strong></p>
                  <p>Ongoing: <strong>{projects.filter(p => p.status === 'In Progress').length}</strong></p>
                  <p>Completed: <strong>{projects.filter(p => p.status === 'Completed').length}</strong></p>
                  <a href="/create-project" className="btn btn-primary btn-sm mt-2">Manage Projects</a>
                </div>
              </div>
            </div>

            {/* Countdown Section */}
            <div className="col-md-4">
              <div className="card border-danger shadow h-100">
                <div className="card-body">
                  <h5 className="card-title text-danger">Next Deadline</h5>
                  <p className="text-muted">Upcoming project launch in:</p>
                  <h3 className="text-danger">Coming Soon</h3>
                  <a href="/deadlines" className="btn btn-outline-danger btn-sm mt-3">View Deadlines</a>
                </div>
              </div>
            </div>

            {/* Admin Setup */}
            <div className="col-md-4">
              <div className="card border-success shadow h-100">
                <div className="card-body">
                  <h5 className="card-title text-success">Setup & Roles</h5>
                  <p>Assign roles and configure access for new admins.</p>
                  <a href="/create-admin" className="btn btn-success btn-sm">+ Create Admin</a>
                </div>
              </div>
            </div>

            {/* Project Table */}
            <div className="col-md-12">
              <div className="card shadow">
                <div className="card-body">
                  <h5 className="card-title">Current Project Status</h5>
                  <table className="table table-striped table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Project Name</th>
                        <th>Status</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project, idx) => (
                        <tr key={project._id}>
                          <td>{idx + 1}</td>
                          <td>{project.name}</td>
                          <td>
                            <span className={`badge bg-${project.status === 'Completed'
                              ? 'success'
                              : project.status === 'In Progress'
                              ? 'warning text-dark'
                              : 'secondary'}`}>
                              {project.status}
                            </span>
                          </td>
                          <td>{project.startDate || '—'}</td>
                          <td>{project.endDate || '—'}</td>
                          <td>
                            <a
                              href={`/edit-project/${project._id}`}
                              className="btn btn-sm btn-outline-primary me-2"
                            >
                              Edit
                            </a>
                            <button
                              onClick={() => deleteProject(project._id)}
                              className="btn btn-sm btn-outline-danger"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {projects.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center">No projects found.</td>
                        </tr>
                        
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
