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

const DigitFlip = ({ value }) => {
  const [prevDigits, setPrevDigits] = useState(() => formatTwoDigits(value).split(''));
  const [flipFlags, setFlipFlags] = useState([false, false]);

  useEffect(() => {
    const newDigits = formatTwoDigits(value).split('');
    const newFlags = [false, false];

    newDigits.forEach((digit, i) => {
      if (digit !== prevDigits[i]) newFlags[i] = true;
    });

    setFlipFlags(newFlags);
    const timeout = setTimeout(() => {
      setPrevDigits(newDigits);
      setFlipFlags([false, false]);
    }, 600);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div style={{ display: 'flex' }}>
      {prevDigits.map((digit, i) => (
        <div className={`flip ${flipFlags[i] ? 'flip-animate' : ''}`} key={i}>
          <div className="flip-inner">
            <div className="flip-front">{digit}</div>
            <div className="flip-back">{formatTwoDigits(value)[i]}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const projectsPerPage = Math.floor(window.innerHeight / 90);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('https://backend-9nfg.onrender.com/api/projects');
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
        if (cd) updated[p._id] = cd;
      });
      setCountdowns(updated);
    }, 1000);
    return () => clearInterval(interval);
  }, [projects]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1 < Math.ceil(projects.length / projectsPerPage) ? prev + 1 : 0));
    }, 30000);
    return () => clearInterval(interval);
  }, [projects.length, projectsPerPage]);

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
    <div style={{ backgroundColor: '#001f3f', color: 'white', fontFamily: 'Arial, sans-serif', height: '100vh', width: '100vw', padding: '10px', overflow: 'hidden' }}>
      <div className="text-center m-3 d-flex justify-content-center align-items-center gap-3">
        <img src={logo} alt="J-Seven Logo" style={{ height: '100px', marginRight: '10px' }} />
      </div>

      <h2 className="text-center text-info mb-5" style={{ fontSize: '2rem' }}>{today}</h2>

      <div className="d-flex justify-content-between align-items-center px-3" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7FDBFF', borderBottom: '2px solid #7FDBFF', paddingBottom: '4px', marginBottom: '8px' }}>
        <div style={{ width: '30%' }}>Project</div>
        <div className="d-flex justify-content-between" style={{ width: '65%' }}>
          <span style={{ marginLeft: '8px' }}>Months</span>
          <span>Days</span>
          <span>Hours</span>
          <span>Minutes</span>
          <span style={{ marginRight: '8px' }}>Seconds</span>
        </div>
      </div>

      <div className="px-3" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
       {displayedProjects.map((project) => {
  const cd = countdowns[project._id];
  const isOnHold = project.status === 'On Hold';

  return (
    <div key={project._id} className="d-flex justify-content-between align-items-center"
      style={{
        backgroundColor: isOnHold ? '#ffcccc' : '#e6f7ff',  // red for On Hold, blue otherwise
        color: isOnHold ? '#990000' : '#003366',             // red text for On Hold
        borderRadius: '10px',
        padding: '10px 15px',
        fontSize: '2rem',
        minHeight: '90px',
        border: isOnHold ? '2px solid #cc0000' : '2px solid #0074D9'
      }}
    >
      <div style={{ width: '30%', fontWeight: 'bold', color: isOnHold ? '#cc0000' : '#0074D9' }}>
        {project.name}
      </div>
      <div className="d-flex justify-content-between align-items-center" style={{ width: '65%' }}>
      {isOnHold ? (
  <span style={{ fontWeight: 'bold', color: '#dc3545' }}>{project.status}</span> // Red for On Hold
) : project.status === 'Completed' || project.status === 'To Be Announced' ? (
  <span className="text-primary" style={{ fontWeight: 'bold' }}>{project.status}</span> // Blue
) : cd ? (
  <>
    <DigitFlip value={cd.months} />
    <DigitFlip value={cd.days} />
    <DigitFlip value={cd.hours} />
    <DigitFlip value={cd.minutes} />
    <DigitFlip value={cd.seconds} />
  </>
) : (
  <span className="text-primary" style={{ fontWeight: 'bold' }}>Completed</span> // Countdown is over = completed
)}


      </div>
    </div>
  );
})}

      </div>

   <style>{`
  .flip {
    position: relative;
    width: 80px; /* increased width */
    height: 100px; /* increased height */
    perspective: 1000px;
    margin: 0 6px; /* more spacing between digits */
  }

  .flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
  }

  .flip.flip-animate .flip-inner {
    animation: flipDown 0.6s ease-in-out forwards;
  }

  @keyframes flipDown {
    0% { transform: rotateX(0deg); }
    50% { transform: rotateX(-90deg); }
    100% { transform: rotateX(-180deg); }
  }

  .flip-front, .flip-back {
    position: absolute;
    width: 100%;
    height: 100%;
    line-height: 100px; /* match new height */
    backface-visibility: hidden;
    background-color: #007BFF;
    color: white;
    border-radius: 10px;
    font-weight: bold;
    font-size: 2.5rem; /* increased font size */
    text-align: center;
    box-shadow: 0 6px 12px rgba(0,0,0,0.3);
  }

  .flip-front { transform: rotateX(0deg); z-index: 2; }
  .flip-back { transform: rotateX(180deg); }
`}</style>


    </div>
  );
};

export default Home;
