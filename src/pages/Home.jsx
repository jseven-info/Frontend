import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/logo-jseven.png';


const formatTwoDigits = (num) => String(num).padStart(2, '0');

const calculateCountdown = (endDate) => {
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  const distance = end - now;

  if (distance <= 0) return null;

  const months = Math.floor(distance / (1000 * 60 * 60 * 24 * 30));
  const days = Math.floor((distance % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return { months, days, hours, minutes, seconds };
};

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const projectsPerPage = 12;

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
        const cd = calculateCountdown(p.endDate);
        if (cd) {
          updated[p._id] = cd;
        }
      });

      setCountdowns(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [projects]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) =>
        prev + 1 < Math.ceil(projects.length / projectsPerPage) ? prev + 1 : 0
      );
    }, 30000);
    return () => clearInterval(interval);
  }, [projects.length]);

  const displayedProjects = projects.slice(
    currentPage * projectsPerPage,
    (currentPage + 1) * projectsPerPage
  );

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      style={{
        backgroundColor: '#001f3f',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        height: '100vh',
        width: '100vw',
        padding: '10px',
        overflow: 'hidden',
      }}
    >
   <div className="text-center m-3 d-flex justify-content-center align-items-center gap-3">
 <img
  src={logo}
  alt="J-Seven Logo"
  style={{ height: '50px', marginRight: '10px' }}
/>
  <h1 style={{ fontSize: '2.2rem', color: 'white', marginBottom: '0' }}>J-Seven Projects</h1>
</div>


      <h2 className="text-center text-info mb-5" style={{ fontSize: '1.4rem', marginBottom: '10px' }}>
        {today}
      </h2>

      {/* Column Headers */}
      <div
        className="d-flex justify-content-between align-items-center px-3"
        style={{
          fontSize: '1rem',
          fontWeight: 'bold',
          color: '#7FDBFF',
          borderBottom: '2px solid #7FDBFF',
          paddingBottom: '4px',
          marginBottom: '8px',
        }}
      >
        <div style={{ width: '30%' }}>Project</div>
        <div className="d-flex justify-content-between" style={{ width: '65%' }}>
          <span>Month</span>
          <span>Day</span>
          <span>Hr</span>
          <span>Min</span>
          <span>Sec</span>
        </div>
      </div>

      {/* Project List */}
      <div className="px-3" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {displayedProjects.map((project) => {
          const cd = countdowns[project._id];

          return (
            <div
              key={project._id}
              className="d-flex justify-content-between align-items-center"
              style={{
                backgroundColor: cd ? '#ffffff' : '#ffe6e6',
                color: cd ? '#001f3f' : '#990000',
                borderRadius: '10px',
                padding: '10px 15px',
                fontSize: '1.4rem',
                minHeight: '60px',
              }}
            >
              <div style={{ width: '30%', fontWeight: 'bold', color: cd ? '#0074D9' : '#990000' }}>
                {project.name}
              </div>
              <div className="d-flex justify-content-between" style={{ width: '65%' }}>
                {cd ? (
                  <>
                    <span>{formatTwoDigits(cd.months)}</span>
                    <span>{formatTwoDigits(cd.days)}</span>
                    <span>{formatTwoDigits(cd.hours)}</span>
                    <span>{formatTwoDigits(cd.minutes)}</span>
                    <span>{formatTwoDigits(cd.seconds)}</span>
                  </>
                ) : (
                  <span className="text-danger">Expired</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
