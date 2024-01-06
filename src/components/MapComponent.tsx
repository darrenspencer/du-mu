import React, { useEffect, useRef } from 'react';

interface RunningClub {
  name: string;
  google_maps: string; // Assuming this is the place ID
}

const MapComponent = ({ clubs }: { clubs: RunningClub[] }) => {
  const mapRef = useRef<google.maps.Map>();
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    // Initialize map
    const mapElement = document.getElementById('map') as HTMLElement;
    mapRef.current = new google.maps.Map(mapElement, {
      zoom: 12,
      center: { lat: 37.7749, lng: -122.4194 }, // Coordinates for San Francisco
    });
  }, []);

  useEffect(() => {
    const bounds = new google.maps.LatLngBounds();

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    clubs.forEach(club => {
      if (club.google_maps) {
        const service = new google.maps.places.PlacesService(mapRef.current as google.maps.Map);
        service.getDetails({ placeId: club.google_maps, fields: ['name', 'geometry'] }, (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
            const marker = new google.maps.Marker({
              map: mapRef.current,
              position: place.geometry.location,
            });

            // Create an InfoWindow
            const infoWindow = new google.maps.InfoWindow({
              content: `<div><strong>${club.name}</strong></div>`
            });

            // Add click listener to open InfoWindow on marker click
            marker.addListener("click", () => {
              infoWindow.open({
                anchor: marker,
                map: mapRef.current,
                shouldFocus: false,
              });
            });

            bounds.extend(place.geometry.location);
            markersRef.current.push(marker);
            mapRef.current?.fitBounds(bounds);
          }
        });
      }
    });
  }, [clubs]); // Dependency array includes clubs, so this effect runs when clubs data changes

  return <div id="map" style={{ height: '400px', width: '100%' }} />;
};

export default MapComponent;
