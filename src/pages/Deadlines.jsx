import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Deadlines = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://backend-9nfg.onrender.com/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data || []);
    } catch (err) {
      console.error('❌ Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Helper for badge colors
  const badgeClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'warning text-dark';
      case 'on hold':
        return 'danger';
      case 'to be announced':
      case 'tba':
        return 'info';
      default:
        return 'secondary';
    }
  };

  // All projects with valid endDate, sorted by endDate (both future and past)
  const withDeadline = projects
    .filter((p) => p.endDate)
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Project Deadlines</h3>

      {loading ? (
        <p>Loading...</p>
      ) : withDeadline.length === 0 ? (
        <p>No projects with deadlines found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Project Name</th>
                <th>Status</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {withDeadline.map((project, index) => (
                <tr key={project._id}>
                  <td>{index + 1}</td>
                  <td>{project.name || 'Unnamed Project'}</td>
                  <td>
                    <span className={`badge bg-${badgeClass(project.status)}`}>
                      {project.status || 'Unknown'}
                    </span>
                  </td>
                  <td>{new Date(project.endDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Deadlines;
