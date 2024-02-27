import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home'; // Assuming you have a Home component
import RunningClubs from './components/RunningClubs';
import CyclingClubs from './components/CyclingClubs';
import SwimmingClubs from './components/SwimmingClubs';
import TriathlonClubs from './components/TriathlonClubs';
import ClimbingGyms from './components/ClimbingGyms';
import ThermalTherapy from './components/ThermalTherapy';
import LineDancing from './components/LineDancing';
import NavigationBar from './components/NavigationBar';

const App = () => {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/running-clubs" element={<RunningClubs />} />
        <Route path="/cycling-clubs" element={<CyclingClubs />} />
        <Route path="/swimming-clubs" element={<SwimmingClubs />} />
        <Route path="/triathlon-clubs" element={<TriathlonClubs />} />
        <Route path="/climbing-gyms" element={<ClimbingGyms />} />
        <Route path="/thermal-therapy" element={<ThermalTherapy />} />
        <Route path="/line-dancing" element={<LineDancing />} />        
      </Routes>
    </Router>
  );
};

export default App;
