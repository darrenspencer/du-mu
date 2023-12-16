import React, { useEffect, useState } from 'react';

// Define the CyclingClub interface
interface CyclingClub {
  name: string;
  description: string;
  instagram: string;
  website: string;
  strava: string;
  annual_fee: number;
  area: string;
  days: string[];
  beginner_friendly: boolean;
}

const CyclingClubs = () => {
  const [clubs, setClubs] = useState<CyclingClub[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [isBeginnerFriendly, setIsBeginnerFriendly] = useState(false);

  useEffect(() => {
    const SHEET_ID = '1g5nRXvkbsstF49XbNXGIgt_Jc1ML-MD0pKdeDtiEDAU';
    const RANGE = 'CyclingClubs!A1:J4';
    const API_KEY = 'AIzaSyCdlizmgvxUmwRaojnncaO7J-QHnnyy11M';
    const URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    fetch(URL)
    .then(response => response.json())
    .then(data => {
      const rows = data.values || [];
      const clubsData = rows.slice(1).map((row: any[]) => ({
        name: row[1],
        description: row[2],
        instagram: row[3],
        website: row[4],
        strava: row[5],
        annual_fee: parseInt(row[6], 10),
        area: row[7],
        days: row[8] ? row[8].split(',').map((day: string) => day.trim()) : [], // Handle empty 'days'
        beginner_friendly: row[9] === 'Beginner friendly'
      }));
      setClubs(clubsData);
      setAreas(Array.from(new Set(clubsData.map((club: CyclingClub) => club.area))));
    })
    .catch(error => console.error('Error fetching data:', error));
}, []);

const filteredClubs = clubs.filter(club => {
    return (!selectedArea || club.area === selectedArea) &&
           (!selectedDays.length || selectedDays.every(day => club.days.includes(day))) &&
           (!maxPrice || club.annual_fee <= maxPrice) && // Correctly check max price
           (!isBeginnerFriendly || club.beginner_friendly);
  });
  

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const day = e.target.value;
    setSelectedDays(selectedDays.includes(day) ? selectedDays.filter(d => d !== day) : [...selectedDays, day]);
  };

  return (
    <div>
      <h1>Cycling Clubs</h1>

      {/* Filters */}
      <div className="filters">
                {/* Maximum Price Filter */}
                <label>
          Annual fee max:
          <input 
            type="number" 
            value={maxPrice ?? ''} 
            onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) : null)} 
          />
        </label>
        {/* Days Filter */}
        <div className="days-filter">
          {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Periodic"].map(day => (
            <label key={day}>
              <input 
                type="checkbox" 
                value={day} 
                checked={selectedDays.includes(day)} 
                onChange={handleDayChange} 
              />
              {day}
            </label>
          ))}
        </div>

        {/* Area Filter */}
        <label>
          Area:
          <select value={selectedArea ?? ''} onChange={(e) => setSelectedArea(e.target.value || null)}>
            <option value="">Select an Area</option>
            {areas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </label>

        {/* Beginner Friendly Filter */}
        <label>
          Beginner friendly:
          <input 
            type="checkbox" 
            checked={isBeginnerFriendly} 
            onChange={(e) => setIsBeginnerFriendly(e.target.checked)} 
          />
        </label>
      </div>

      {/* Club Listings */}
      <ul>
        {filteredClubs.map((club, index) => (
          <li key={index} className="club-listing">
            <h2>{club.name}</h2>
            <p>{club.description}</p>
            <div className="club-links">
              {club.instagram && <a href={club.instagram} target="_blank" rel="noopener noreferrer"><img src="/icons/instagram.png" alt="Instagram" /></a>}
              {club.website && <a href={club.website} target="_blank" rel="noopener noreferrer"><img src="/icons/website.png" alt="Website" /></a>}
              {club.strava && <a href={club.strava} target="_blank" rel="noopener noreferrer"><img src="/icons/strava.png" alt="Strava" /></a>}
            </div>
            <p>Annual Fee: ${club.annual_fee}</p>
            <p>Area: {club.area}</p>
            <p>Days: {club.days.join(', ')}</p>
            {club.beginner_friendly && <span className="beginner-friendly-tag">Beginner friendly</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CyclingClubs;
