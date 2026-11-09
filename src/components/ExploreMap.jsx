import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import {
  Activity,
  Camera,
  CarFront,
  Coffee,
  Compass,
  Flame,
  Mountain,
  Music,
  ShoppingBag,
  Smile,
  Utensils,
  Wine,
} from 'lucide-react';

const API_KEY = import.meta.env.VITE_STADIA_API_KEY || process.env.REACT_APP_STADIA_API_KEY || '';

// Сопоставление категорий с иконками Figma
const iconMap = {
  'Food & Drinks': Utensils,
  Nightlife: Wine,
  'Outdoor & Active': Mountain,
  Sightseeing: Camera,
  Entertainment: Music,
  Shopping: ShoppingBag,
  Wellness: Activity,
  Social: Coffee,
  Rideshare: CarFront,
  Other: Smile,
  coffee: Coffee,
  drink: Wine,
  music: Music,
  party: Flame,
  photo: Camera,
  food: Utensils,
  shopping: ShoppingBag,
  travel: Compass,
  sport: Activity,
  other: Smile,
};

// Создание круглого маркера в стиле Figma (#FF7FC0)
const createCustomIcon = (type = 'coffee', isDark) => {
  const IconComponent = iconMap[type] || Coffee;
  
  const iconHtml = renderToString(
    <div className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all shadow-md hover:scale-110 cursor-pointer ${
      isDark 
        ? 'bg-[#1e1726]/85 border-[#ff7fc0]/70 text-[#ff7fc0] backdrop-blur-sm' 
        : 'bg-white/90 border-[#ff7fc0] text-[#ff7fc0] shadow-pink-500/10'
    }`}>
      <IconComponent className="w-4 h-4 stroke-[2.2]" />
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: 'custom-map-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

export default function ExploreMap({ isDark = true, center, events = [], onMapClick }) {
  const defaultCenter = [40.730610, -73.935242];
  const activeCenter = center || defaultCenter;

  const baseTileUrl = API_KEY 
    ? `https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png?api_key=${API_KEY}`
    : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={activeCenter} 
        zoom={12} 
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <MapController center={center} />
        <MapClickHandler onMapClick={onMapClick} />

        <TileLayer
          key={isDark ? 'dark-map-layer' : 'light-map-layer'}
          url={baseTileUrl}
          className={isDark ? '[filter:invert(100%)_hue-rotate(180deg)_brightness(0.88)_contrast(1.12)]' : ''}
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; OpenStreetMap'
          maxZoom={20}
        />

        {/* Динамические маркеры событий */}
        {events.map((evt) => (
          <Marker 
            key={evt.id} 
            position={[evt.lat, evt.lng]} 
            icon={createCustomIcon(evt.category || evt.type, isDark)}
          >
            <Popup>
              <div className="p-1 font-sans min-w-[140px]">
                <span className="text-[10px] font-bold tracking-wider text-[#ff7fc0] uppercase">
                  {evt.category || 'Event'}
                </span>
                <h4 className="font-bold text-sm text-gray-900 mt-0.5">{evt.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{evt.date || 'Today'} • {evt.people || 'Open'}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}