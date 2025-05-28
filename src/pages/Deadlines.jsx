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

  // Helper to get badge class
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

  const getComputedStatus = (project) => {
    if (project.endDate && new Date(project.endDate) < new Date()) {
      return 'Completed';
    }
    return project.status || 'Unknown';
  };

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
              {withDeadline.map((project, index) => {
                const computedStatus = getComputedStatus(project);
                return (
                  <tr key={project._id}>
                    <td>{index + 1}</td>
                    <td>{project.name || 'Unnamed Project'}</td>
                    <td>
                      <span className={`badge bg-${badgeClass(computedStatus)}`}>
                        {computedStatus}
                      </span>
                    </td>
                    <td>{new Date(project.endDate).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Deadlines;
