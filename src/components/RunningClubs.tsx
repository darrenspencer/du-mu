import React, { useEffect, useState } from 'react';
import MapComponent from './MapComponent';

// Define the RunningClub interface
interface RunningClub {
  name: string;
  description: string;
  instagram: string;
  website: string;
  strava: string;
  annual_fee: number;
  area: string;
  days: string[];
  beginner_friendly: boolean;
  google_maps: string;
  social: boolean;
  very_social: boolean;
  terrains: string[];
}

const RunningClubs = () => {
  const [clubs, setClubs] = useState<RunningClub[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [isBeginnerFriendly, setIsBeginnerFriendly] = useState(false);
  const [isSocial, setIsSocial] = useState(false);
  const [isVerySocial, setIsVerySocial] = useState(false);
  const [selectedTerrains, setSelectedTerrains] = useState<string[]>([]);

  useEffect(() => {
    const SHEET_ID = '1g5nRXvkbsstF49XbNXGIgt_Jc1ML-MD0pKdeDtiEDAU';
    const RANGE = 'RunningClubs!A1:N39';
    const API_KEY = 'AIzaSyCdlizmgvxUmwRaojnncaO7J-QHnnyy11M';
    const URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
  
    fetch(URL)
    .then(response => response.json())
    .then(data => {
      const rows = data.values || [];
      const clubsData = rows.slice(1).map((row: any[]) => {
        let fee = row[6];
        let annualFeeValue;
        if (fee.toLowerCase() === 'free') {
          annualFeeValue = 0;
        } else {
          annualFeeValue = parseInt(fee, 10);
          if (isNaN(annualFeeValue)) {
            annualFeeValue = null; // Set to null if not a valid number
          }
        }
  
        return {
          name: row[1],
          description: row[2],
          instagram: row[3],
          website: row[4],
          strava: row[5],
          annual_fee: annualFeeValue,
          area: row[7],
          days: row[8] ? row[8].split(',').map((day: string) => day.trim()) : [], 
          beginner_friendly: row[9] === 'Beginner friendly',
          google_maps: row[10] || '',
          social: row[11] === 'Social',
          very_social: row[12] === 'Very social',
          terrains: row[13] ? row[13].split(',').map((terrain: string) => terrain.trim()) : [],
        };
      });
      setClubs(clubsData);
      setAreas(Array.from(new Set(clubsData.map((club: RunningClub) => club.area))));
    })
    .catch(error => console.error('Error fetching data:', error));
  }, []);
    

  const filteredClubs = clubs.filter((club: RunningClub) => {
    // Include clubs with unknown annual fees (null values) when no maxPrice is set
    const isFeeAcceptable = maxPrice === null ? club.annual_fee !== undefined : (club.annual_fee !== null && club.annual_fee <= maxPrice);
    const isAreaSelected = !selectedArea || club.area === selectedArea;
    const isDaySelected = selectedDays.length === 0 || selectedDays.every(day => club.days.includes(day));
    const isFilterBeginnerFriendly = !isBeginnerFriendly || club.beginner_friendly;
    const isFilterSocial = !isSocial || club.social;
    const isFilterVerySocial = !isVerySocial || club.very_social;
    const isTerrainSelected = selectedTerrains.length === 0 || selectedTerrains.every(terrain => club.terrains.includes(terrain));
  
    return isFeeAcceptable && isAreaSelected && isDaySelected && isFilterBeginnerFriendly && isFilterSocial && isFilterVerySocial && isTerrainSelected;
  });
  

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const day = e.target.value;
    setSelectedDays(selectedDays.includes(day) ? selectedDays.filter(d => d !== day) : [...selectedDays, day]);
  };

  const handleTerrainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const terrain = e.target.value;
    setSelectedTerrains(selectedTerrains.includes(terrain) ? selectedTerrains.filter(d => d !== terrain) : [...selectedTerrains, terrain]);
  };

  return (
    <div>
      <h1>Running Clubs</h1>

      {/* Filters */}
      <div className="filters">

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

{/* Days Filter */}
<div className="days-filter">
  <label className="filter-label">Active days:</label>
  <div className="days-checkboxes">
    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Periodic"].map(day => (
      <label key={day} className="day-checkbox">
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
</div>

        {/* Terrains Filter */}
        <div className="terrains-filter">
        <label className="filter-label">Terrain:</label>
  <div className="terrains-checkboxes">
          {["Road", "Trail", "Track"].map(terrain => (
            <label key={terrain} className="terrain-checkbox">
              <input 
                type="checkbox" 
                value={terrain} 
                checked={selectedTerrains.includes(terrain)} 
                onChange={handleTerrainChange} 
              />
              {terrain}
              </label>
    ))}
  </div>
</div>

                {/* Maximum Price Filter */}
                <label>
          Annual fee max:
          <input 
            type="number" 
            value={maxPrice ?? ''} 
            onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) : null)} 
          />
        </label>

{/* Beginner Friendly Filter */}
<div className="beginner-friendly-filter">
  <label>
    Beginner friendly (all speeds, no experience needed):
    <input 
      type="checkbox" 
      checked={isBeginnerFriendly} 
      onChange={(e) => setIsBeginnerFriendly(e.target.checked)} 
    />
  </label>
</div>


{/* Social Filter */}
<div className="social-filter">
  <label>
    Social (socializing after runs):
    <input 
      type="checkbox" 
      checked={isSocial} 
      onChange={(e) => setIsSocial(e.target.checked)} 
    />
  </label>
</div>

{/* Very Social Filter */}
<div className="very-social-filter">
  <label>
    Very social (social is more important than the run):
    <input 
      type="checkbox" 
      checked={isVerySocial} 
      onChange={(e) => setIsVerySocial(e.target.checked)} 
    />
  </label>
</div>

        {/* Google Map */}
      <MapComponent clubs={filteredClubs} />
      </div>

{/* Club Listings */}
<ul>
  {filteredClubs.map((club, index) => (
    <li key={index} className="club-listing">
      <h2>{club.name}</h2>
      <div>{club.description}</div>
      <div className="club-links">
        {club.instagram && <a href={club.instagram} target="_blank" rel="noopener noreferrer"><img src="/icons/instagram.png" alt="Instagram" /></a>}
        {club.website && <a href={club.website} target="_blank" rel="noopener noreferrer"><img src="/icons/website.png" alt="Website" /></a>}
        {club.strava && <a href={club.strava} target="_blank" rel="noopener noreferrer"><img src="/icons/strava.png" alt="Strava" /></a>}
      </div>
      <div><strong>Area:</strong> {club.area}</div>
      <div><strong>Days:</strong> {club.days.join(', ')}</div>
      <div><strong>Terrains:</strong> {club.terrains.join(', ')}</div>
      <div><strong>Annual Fee:</strong> {club.annual_fee === 0 ? 'Free' : (club.annual_fee ? `$${club.annual_fee}` : 'Unknown')}</div>
      <div className="club-tags">
        {club.beginner_friendly && <span className="beginner-friendly-tag">Beginner friendly</span>}
        {club.social && <span className="social-tag">Social</span>}
        {club.very_social && <span className="very-social-tag">Very social</span>}
      </div>    
    </li>
  ))}
</ul>
</div>
);
};

export default RunningClubs;
