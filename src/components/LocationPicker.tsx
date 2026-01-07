"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icon issue
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}

// Component to handle map clicks and update marker
function MapClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to recenter map when location changes
function MapCenterUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [map, lat, lng]);
  
  return null;
}

// Component to get user's current location
function LocationButton({ onLocationFound }: { onLocationFound: (lat: number, lng: number) => void }) {
  const map = useMap();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationFound(latitude, longitude);
          map.setView([latitude, longitude], 16);
          setLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Tidak dapat mengakses lokasi Anda. Pastikan GPS aktif dan izinkan akses lokasi.");
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      alert("Browser Anda tidak mendukung geolokasi.");
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="absolute top-3 right-3 z-[1000] bg-white px-3 py-2 rounded-lg shadow-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
        </svg>
      )}
      {loading ? "Mencari..." : "Lokasi Saya"}
    </button>
  );
}

export default function LocationPicker({ latitude, longitude, onLocationChange }: LocationPickerProps) {
  // Default to center of Indonesia if no location
  const defaultLat = -2.5489;
  const defaultLng = 118.0149;
  const defaultZoom = latitude && longitude ? 16 : 5;
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    latitude || defaultLat,
    longitude || defaultLng,
  ]);

  const handleLocationChange = useCallback((lat: number, lng: number) => {
    onLocationChange(lat, lng);
    setMapCenter([lat, lng]);
  }, [onLocationChange]);

  return (
    <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 h-64">
      <MapContainer
        center={mapCenter}
        zoom={defaultZoom}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onLocationChange={handleLocationChange} />
        <LocationButton onLocationFound={handleLocationChange} />
        
        {latitude && longitude && (
          <>
            <Marker 
              position={[latitude, longitude]} 
              icon={markerIcon}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  handleLocationChange(position.lat, position.lng);
                },
              }}
            />
            <MapCenterUpdater lat={latitude} lng={longitude} />
          </>
        )}
      </MapContainer>
      
      {/* Instructions */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-gray-600 max-w-[200px]">
        Klik pada peta atau gunakan tombol &quot;Lokasi Saya&quot;
      </div>
    </div>
  );
}





