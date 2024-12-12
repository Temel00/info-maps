"use client";

import { useEffect, useRef, useState } from "react";

const LOCATIONS = [
  {
    id: 1,
    name: "Central Park",
    address: "Central Park West, New York, NY 10024",
    coords: { lat: 40.7829, lng: -73.9654 },
  },
  {
    id: 2,
    name: "Empire State Building",
    address: "350 5th Ave, New York, NY 10118",
    coords: { lat: 40.7484, lng: -73.9857 },
  },
  {
    id: 3,
    name: "Times Square",
    address: "Manhattan, NY 10036",
    coords: { lat: 40.758, lng: -73.9855 },
  },
];

const LocationMap = () => {
  const mapRef = useRef(null);
  const listRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&v=beta&libraries=marker`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      script.onload = initializeMap;
    };

    loadGoogleMapsScript();
  }, []);

  const initializeMap = () => {
    if (!mapRef.current) return;

    const bounds = new google.maps.LatLngBounds();
    LOCATIONS.forEach((location) => {
      bounds.extend(location.coords);
    });

    const mapInstance = new google.maps.Map(mapRef.current, {
      zoom: 12,
      mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID,
    });

    mapInstance.fitBounds(bounds);
    setMap(mapInstance);

    const newMarkers = LOCATIONS.map((location) => {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: location.coords,
        map: mapInstance,
        title: location.name,
        content: new google.maps.marker.PinElement({
          glyph: location.name[0],
          background: "#1E88E5",
          borderColor: "#1565C0",
        }).element,
      });

      marker.addListener("gmp-click", () => {
        handleLocationSelect(location);
      });

      return { marker, location };
    });

    setMarkers(newMarkers);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);

    if (map) {
      map.panTo(location.coords);
      map.setZoom(15);
    }

    const listItem = document.getElementById(`location-${location.id}`);
    if (listItem) {
      listItem.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    markers.forEach(({ marker, location: markerLocation }) => {
      if (markerLocation.id === location.id) {
        const pinBackground = marker.content.style.background;
        marker.content.style.background = "#FFD700";
        setTimeout(() => {
          marker.content.style.background = pinBackground;
        }, 1500);
      }
    });
  };

  return (
    <div className="location-map-wrapper">
      <div className="map-section">
        <div ref={mapRef} className="map-container" />
      </div>

      <div className="list-section">
        <div ref={listRef} className="list-container">
          <ul className="location-list">
            {LOCATIONS.map((location) => (
              <li
                key={location.id}
                id={`location-${location.id}`}
                className={`location-item ${
                  selectedLocation?.id === location.id ? "selected" : ""
                }`}
                onClick={() => handleLocationSelect(location)}
              >
                <h3 className="location-name">{location.name}</h3>
                <p className="location-address">{location.address}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
