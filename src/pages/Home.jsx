import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const calculateCountdown = (endDate) => {
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  const distance = end - now;

  if (distance <= 0) return { months: 0, days: 0, minutes: 0, seconds: 0 };

  const months = Math.floor(distance / (1000 * 60 * 60 * 24 * 30));
  const days = Math.floor((distance % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return { months, days, minutes, seconds };
};

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const projectsPerPage = 6;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/projects');
        setProjects(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch projects:', err);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = {};
      projects.forEach((p) => {
        updated[p._id] = calculateCountdown(p.endDate);
      });
      setCountdowns(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [projects]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prevPage) =>
        prevPage + 1 < Math.ceil(projects.length / projectsPerPage) ? prevPage + 1 : 0
      );
    }, 30000); // Change page every 30 seconds

    return () => clearInterval(interval);
  }, [projects.length]);

  const displayedProjects = projects.slice(
    currentPage * projectsPerPage,
    (currentPage + 1) * projectsPerPage
  );

  return (
    <div>
      <header className="bg-dark text-white p-3 d-flex justify-content-between align-items-center shadow">
        <h1 className="h4 m-0">J SEVEN PROJECTS</h1>
        <button
          className="btn btn-outline-light"
          onClick={() => (window.location.href = '/login')}
        >
          Login
        </button>
      </header>

      <div className="container mt-4">
        <div className="row">
          {displayedProjects.map((project) => {
            const cd = countdowns[project._id] || {};
            return (
              <div className="col-md-6 col-lg-4 mb-4" key={project._id}>
                <div className="card h-100 shadow border-0 rounded-4">
                  <div className="card-body text-center">
                    <h5 className="card-title text-primary fw-bold">{project.name}</h5>
                    <p className="text-muted small">
                      <strong>Start:</strong>{' '}
                      {new Date(project.startDate).toLocaleDateString()}
                      <br />
                      <strong>End:</strong>{' '}
                      {new Date(project.endDate).toLocaleDateString()}
                    </p>
                    <div className="bg-light p-4 border rounded-4 shadow-sm">
                      <h5 className="fw-bold text-uppercase text-danger mb-3">Countdown</h5>
                      <div className="d-flex justify-content-center gap-3 fs-2 fw-bold">
                        <span className="badge bg-danger px-3 py-2">{cd.months}M</span>
                        <span className="badge bg-warning text-dark px-3 py-2">{cd.days}D</span>
                        <span className="badge bg-success px-3 py-2">{cd.minutes}m</span>
                        <span className="badge bg-primary px-3 py-2">{cd.seconds}s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {projects.length === 0 && (
          <div className="text-center text-muted mt-5">No projects found.</div>
        )}
      </div>
    </div>
  );
};

export default Home;
