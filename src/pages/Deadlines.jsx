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

  useEffect(() => {
    fetchProjects();
  }, []);

  const upcoming = projects
    .filter(p => p.endDate && new Date(p.endDate) > new Date())
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Upcoming Project Deadlines</h3>
      {loading ? (
        <p>Loading...</p>
      ) : upcoming.length === 0 ? (
        <p>No upcoming deadlines found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Project Name</th>
                <th>Status</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((p, index) => (
                <tr key={p._id}>
                  <td>{index + 1}</td>
                  <td>{p.name}</td>
                  <td>
                    <span className={`badge bg-${p.status === 'Completed' ? 'success' : p.status === 'In Progress' ? 'warning text-dark' : 'secondary'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>{new Date(p.endDate).toLocaleDateString()}</td>
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

