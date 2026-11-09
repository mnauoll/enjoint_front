import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { Camera, Utensils, Coffee, Music, Flame } from 'lucide-react';

const API_KEY = import.meta.env.VITE_STADIA_API_KEY || process.env.REACT_APP_STADIA_API_KEY || '';

const iconMap = {
  photo: Camera,
  food: Utensils,
  coffee: Coffee,
  music: Music,
  party: Flame,
};

const createCustomIcon = (type = 'party', isDark) => {
  const IconComponent = iconMap[type] || Flame;
  
  const iconHtml = renderToString(
    <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 transition-transform hover:scale-110 cursor-pointer ${
      isDark 
        ? 'bg-[#1a1625] border-[#ff7fc0] text-[#ff7fc0]' 
        : 'bg-white border-[#ff7fc0] text-[#ff7fc0]'
    }`}>
      <IconComponent className="w-4 h-4" />
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

  // Использованием ОДИН И ТОТ ЖЕ тайловый источник OSM Bright для обеих тем,
  // чтобы шрифты, номера дорог и детальность были абсолютно одинаковыми.
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

        {/* 
          Для тёмной темы применяем инверсию цветов: 
          она превращает светлый OSM Bright в идеальную тёмную карту, 
          сохраняя ВСЕ шрифты, геометрию и детализацию исходной карты.
        */}
        <TileLayer
          key={isDark ? 'dark-map-layer' : 'light-map-layer'}
          url={baseTileUrl}
          className={isDark ? '[filter:invert(100%)_hue-rotate(180deg)_brightness(0.88)_contrast(1.12)]' : ''}
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; OpenStreetMap'
          maxZoom={20}
        />

        {/* Маркеры событий */}
        {events.map((evt) => (
          <Marker 
            key={evt.id} 
            position={[evt.lat, evt.lng]} 
            icon={createCustomIcon(evt.type, isDark)}
          >
            <Popup>
              <div className="p-1 font-sans">
                <h4 className="font-bold text-sm text-gray-900">{evt.title}</h4>
                <p className="text-xs text-gray-500 capitalize">Категория: {evt.type}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}