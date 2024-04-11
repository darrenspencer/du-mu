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
        <Link to="/music">Music</Link>
          </div>
    </nav>
  );
};

export default NavigationBar;
