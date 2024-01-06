import React, { useEffect, useState } from 'react';

// Define the TriathlonClub interface
interface TriathlonClub {
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

const TriathlonClubs = () => {
  const [clubs, setClubs] = useState<TriathlonClub[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [isBeginnerFriendly, setIsBeginnerFriendly] = useState(false);

  useEffect(() => {
    const SHEET_ID = '1g5nRXvkbsstF49XbNXGIgt_Jc1ML-MD0pKdeDtiEDAU';
    const RANGE = 'TriathlonClubs!A1:J100';
    const API_KEY = 'AIzaSyCdlizmgvxUmwRaojnncaO7J-QHnnyy11M';
    const URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
  
    fetch(URL)
    .then(response => response.json())
    .then(data => {
      const rows = data.values || [];
      const clubsData = rows.slice(1).map((row: any[]) => {
        // Determine the annual fee value
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
          beginner_friendly: row[9] === 'Beginner friendly'
        };
      });
      setClubs(clubsData);
      setAreas(Array.from(new Set(clubsData.map((club: TriathlonClub) => club.area))));
    })
    .catch(error => console.error('Error fetching data:', error));
  }, []);  

  const filteredClubs = clubs.filter((club: TriathlonClub) => {
    // Exclude clubs with unknown annual fees (null values) when a maxPrice is set
    const isFeeKnown = club.annual_fee !== null;
    const isWithinMaxPrice = maxPrice === null || club.annual_fee <= maxPrice;
    const isAreaSelected = !selectedArea || club.area === selectedArea;
    const isDaySelected = selectedDays.length === 0 || selectedDays.every(day => club.days.includes(day));
    const isFilterBeginnerFriendly = !isBeginnerFriendly || club.beginner_friendly;
  
    return isFeeKnown && isWithinMaxPrice && isAreaSelected && isDaySelected && isFilterBeginnerFriendly;
  });  

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const day = e.target.value;
    setSelectedDays(selectedDays.includes(day) ? selectedDays.filter(d => d !== day) : [...selectedDays, day]);
  };

  return (
    <div>
      <h1>Triathlon Clubs</h1>

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
      <p>Annual Fee: {club.annual_fee === 0 ? 'Free' : (club.annual_fee ? `$${club.annual_fee}` : 'Unknown')}</p>
      <p>Area: {club.area}</p>
      <p>Days: {club.days.join(', ')}</p>
      {club.beginner_friendly && <span className="beginner-friendly-tag">Beginner friendly</span>}
    </li>
  ))}
</ul>
</div>
);
};

export default TriathlonClubs;
