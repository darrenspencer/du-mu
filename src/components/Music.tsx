import React, { useEffect, useState } from 'react';

// Define the Event interface with optional fields
interface Event {
  id: number;
  event: string;
  description?: string;
  date: string;
  website?: string;
  starting_price?: number;
  venue?: string;
  google_maps?: string;
  genre?: string;
}

interface EventsByDate {
  [date: string]: Event[];
}

const MusicEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsByDate, setEventsByDate] = useState<EventsByDate>({});
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  useEffect(() => {
    const SHEET_ID = '1g5nRXvkbsstF49XbNXGIgt_Jc1ML-MD0pKdeDtiEDAU';
    const RANGE = 'Music!A2:I50';
    const API_KEY = 'AIzaSyCdlizmgvxUmwRaojnncaO7J-QHnnyy11M';
    const URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    fetch(URL)
      .then(response => response.json())
      .then(data => {
        const rows = data.values || [];
        const eventsData: Event[] = rows.map((row: any[]): Event => ({
          id: parseInt(row[0], 10),
          event: row[1],
          description: row[2] || '',
          date: row[3],
          website: row[4] || '',
          starting_price: row[5] ? parseInt(row[5], 10) : undefined,
          venue: row[6] || '',
          google_maps: row[7] || '',
          genre: row[8] || ''
        }));

        setEvents(eventsData);
        const groupedByDate: EventsByDate = eventsData.reduce((acc: EventsByDate, event: Event) => {
          if (!acc[event.date]) acc[event.date] = [];
          acc[event.date].push(event);
          return acc;
        }, {});
        
        setEventsByDate(groupedByDate);
        const allGenres = eventsData.flatMap(event => event.genre ? event.genre.split(',').map(genre => genre.trim()) : []);
        setGenres(Array.from(new Set(allGenres)));
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleGenreSelection = (genre: string) => {
    setSelectedGenres(prevGenres =>
      prevGenres.includes(genre) ? prevGenres.filter(g => g !== genre) : [...prevGenres, genre]
    );
  };

  const filteredEvents = Object.entries(eventsByDate).reduce((acc: EventsByDate, [date, events]) => {
    const filtered = events.filter(event => {
      const eventGenres = event.genre ? event.genre.split(',').map(genre => genre.trim()) : [];
      const isGenreMatch = selectedGenres.length === 0 || selectedGenres.some(genre => eventGenres.includes(genre));
      const isPriceAcceptable = maxPrice === null || (event.starting_price !== undefined && event.starting_price <= maxPrice);

      return isGenreMatch && isPriceAcceptable;
    });

    if (filtered.length > 0) {
      acc[date] = filtered;
    }

    return acc;
  }, {});

  return (
    <div>
      <h1>Music Events in Dubai</h1>
      <p>All of the music events in Dubai. If we are missing any, please contact us!</p>

      <div className="filters">
        <strong>Genres:</strong>
        <div>
          {genres.map(genre => (
            <button key={genre} onClick={() => handleGenreSelection(genre)} style={{ margin: '5px', background: selectedGenres.includes(genre) ? '#add8e6' : '#f0f0f0' }}>
              {genre}
            </button>
          ))}
        </div>

        <label>
          <strong>Starting Price Max: </strong>
          <input type="number" value={maxPrice ?? ''} onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value, 10) : null)} />
        </label>
      </div>

      {Object.entries(filteredEvents).map(([date, events]) => (
        <div key={date}>
          <h2>{date}</h2>
          <ul>
            {events.map(event => (
              <li key={event.id} className="event-listing">
                <a href={event.website} target="_blank" rel="noopener noreferrer"><h3>{event.event}</h3></a>
                <div>{event.description}</div>
                <div><strong>Venue:</strong> {event.venue}</div>
                <div><strong>Genres:</strong> {event.genre}</div>
                <div><strong>Starting Price:</strong> {event.starting_price !== undefined ? `AED ${event.starting_price}` : 'N/A'}</div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MusicEvents;
