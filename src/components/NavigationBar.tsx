import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="nav-bar">
      <Link to="/" className="nav-logo">
        <img src="/logo_02b.png" alt="Logo" />
      </Link>
      <div className="nav-menu-icon" onClick={toggleMenu}>
        {/* Hamburger Icon */}
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
        <Link to="/">Home</Link>
        <Link to="/running-clubs">Running Clubs</Link>
        <Link to="/cycling-clubs">Cycling Clubs</Link>
        <Link to="/swimming-clubs">Swimming Clubs</Link>
        <Link to="/triathlon-clubs">Triathlon Clubs</Link>
        <Link to="/climbing-gyms">Climbing Gyms</Link>
        <Link to="/thermal-therapy">Thermal Therapy</Link>
        <Link to="/line-dancing">Line Dancing</Link>
          </div>
    </nav>
  );
};

export default NavigationBar;
