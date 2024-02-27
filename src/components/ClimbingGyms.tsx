import React, { useEffect, useState } from 'react';
import MapComponent from './MapComponent';

// Define the ClimbingGym interface
interface ClimbingGym {
  name: string;
  description: string;
  website: string;
  instagram: string;
  google_maps: string;
  day_pass: string;
  monthly_membership: string;
  initiation_fee: string;
  area: string;
  type: 'Bouldering' | 'Top rope' | 'Lead';
  other_facilities: string[];
}

const ClimbingGyms = () => {
  const [gyms, setGyms] = useState<ClimbingGym[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [dayPassFilter, setDayPassFilter] = useState<string>('');
  const [monthlyMembershipFilter, setMonthlyMembershipFilter] = useState<string>('');

  useEffect(() => {
    const SHEET_ID = '1g5nRXvkbsstF49XbNXGIgt_Jc1ML-MD0pKdeDtiEDAU';
    const RANGE = 'ClimbingGyms!A1:K14';
    const API_KEY = 'AIzaSyCdlizmgvxUmwRaojnncaO7J-QHnnyy11M';
    const URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
  
    fetch(URL)
      .then(response => response.json())
      .then(data => {
        const rows = data.values || [];
        const gymsData = rows.slice(1).map((row: any[]) => ({ // Explicitly type `row` as `any[]`
          name: row[0],
          description: row[1],
          website: row[2],
          instagram: row[3],
          google_maps: row[4],
          day_pass: row[5],
          monthly_membership: row[6],
          initiation_fee: row[7],
          area: row[8],
          type: row[9],
          other_facilities: row[10] ? row[10].split(',').map((facility: string) => facility.trim()) : [],
        }));
        setGyms(gymsData);
        setAreas(Array.from(new Set(gymsData.map((gym: ClimbingGym) => gym.area))));
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);  

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.value;
    setSelectedTypes(selectedTypes.includes(type) ? selectedTypes.filter(t => t !== type) : [...selectedTypes, type]);
  };

  const handleFacilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const facility = e.target.value;
    setSelectedFacilities(selectedFacilities.includes(facility) ? selectedFacilities.filter(f => f !== facility) : [...selectedFacilities, facility]);
  };

  const filteredGyms = gyms.filter((gym: ClimbingGym) => {
    const isAreaSelected = !selectedArea || gym.area === selectedArea;
    const isTypeSelected = selectedTypes.length === 0 || selectedTypes.includes(gym.type);
    const isFacilitySelected = selectedFacilities.length === 0 || selectedFacilities.every(facility => gym.other_facilities.includes(facility));
    const isDayPassFilterMatched = dayPassFilter === '' || gym.day_pass.includes(dayPassFilter);
    const isMonthlyMembershipFilterMatched = monthlyMembershipFilter === '' || gym.monthly_membership.includes(monthlyMembershipFilter);
  
    return isAreaSelected && isTypeSelected && isFacilitySelected && isDayPassFilterMatched && isMonthlyMembershipFilterMatched;
  });  

  return (
    <div>
      <h1>Climbing Gyms</h1>

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

        {/* Type Filter */}
        <div>
          Type:
          {["Bouldering", "Top rope", "Lead"].map(type => (
            <label key={type}>
              <input 
                type="checkbox" 
                value={type} 
                checked={selectedTypes.includes(type)} 
                onChange={handleTypeChange} 
              />
              {type}
            </label>
          ))}
        </div>

        {/* Other Facilities Filter */}
        <div>
          Other Facilities:
          {["Climbing training equipment", "Fitness or yoga", "Gym equipment", "Sauna", "Shower"].map(facility => (
            <label key={facility}>
              <input 
                type="checkbox" 
                value={facility} 
                checked={selectedFacilities.includes(facility)} 
                onChange={handleFacilityChange} 
              />
              {facility}
            </label>
          ))}
        </div>

        {/* Day Pass Filter */}
        <div>
        <label>
          Day pass max ($):
          <input 
            type="text" 
            value={dayPassFilter} 
            onChange={(e) => setDayPassFilter(e.target.value)} 
          />
        </label>
        </div>

        {/* Monthly Membership Filter */}
        <div>
        <label>
          Monthly membership max ($):
          <input 
            type="text" 
            value={monthlyMembershipFilter} 
            onChange={(e) => setMonthlyMembershipFilter(e.target.value)} 
          />
        </label>
        </div>

        {/* Google Map */}
        <MapComponent clubs={filteredGyms as any} />
      </div>

{/* Gym Listings */}
<ul>
  {filteredGyms.map((gym, index) => (
    <li key={index} className="gym-listing">
      <h2>{gym.name}</h2>
      <div>{gym.description}</div>
      <div className="club-links">
        {gym.instagram && <a href={gym.instagram} target="_blank" rel="noopener noreferrer"><img src="/icons/instagram.png" alt="Instagram" /></a>}
        {gym.website && <a href={gym.website} target="_blank" rel="noopener noreferrer"><img src="/icons/website.png" alt="Website" /></a>}
      </div>
      <div><strong>Area:</strong> {gym.area}</div>
      <div><strong>Type:</strong> {gym.type}</div>
      <div><strong>Other facilities:</strong> {gym.other_facilities.join(', ')}</div>
      <div><strong>Day pass price:</strong> ${gym.day_pass}</div>
      <div><strong>Membership monthly price:</strong> ${gym.monthly_membership}</div>
    </li>
  ))}
</ul>
</div>
);
};

export default ClimbingGyms;

