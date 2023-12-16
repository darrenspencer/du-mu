import React from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/running-clubs">Running Clubs</Link>
      <Link to="/cycling-clubs">Cycling Clubs</Link>
      <Link to="/swimming-clubs">Swimming Clubs</Link>
      <Link to="/triathlon-clubs">Triathlon Clubs</Link>
      <Link to="/climbing-gyms">Climbing Gyms</Link>
      <Link to="/thermal-therapy">Thermal Therapy</Link>
      <Link to="/line-dancing">Line Dancing</Link>
    </nav>
  );
};

export default NavigationBar;
