import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Pane, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { POZNAN_CENTER } from '../data/demoEvents';
import EventPreviewCard from './events/EventPreviewCard';
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
      if (
        e.originalEvent.target.closest(
          '.custom-map-marker, .event-preview-overlay',
        )
      ) {
        return;
      }

      if (onMapClick) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

function SelectedLocationMarker({ position }) {
  if (!position) return null;
  const icon = L.divIcon({
    html: '<div style="width:22px;height:22px;border:4px solid white;border-radius:50%;background:#ff65ac;box-shadow:0 2px 12px rgba(0,0,0,.4)"></div>',
    className: "custom-map-marker",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
  return <Marker position={position} icon={icon} />;
}

function EventPreviewOverlay({
  event,
  isDark,
  participantCount,
  isJoined,
  onClose,
  onSeeMore,
  onJoin,
}) {
  const map = useMap();
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!event) return undefined;

    const updatePosition = () => {
      const point = map.latLngToContainerPoint([event.lat, event.lng]);
      setPosition({
        left: Math.min(Math.max(point.x, 150), map.getSize().x - 150),
        top: point.y,
        showBelow: point.y < 250,
      });
    };

    updatePosition();
    map.on('move zoom resize', updatePosition);
    return () => map.off('move zoom resize', updatePosition);
  }, [event, map]);

  if (!event || !position) return null;

  return (
    <Pane name="eventPreviewPane" style={{ zIndex: 710, pointerEvents: 'none' }}>
      <div
        className="event-preview-overlay absolute"
        style={{
          left: position.left,
          top: position.top,
          pointerEvents: 'auto',
          transform: position.showBelow
            ? 'translate(-50%, 24px)'
            : 'translate(-50%, calc(-100% - 24px))',
        }}
      >
        <EventPreviewCard
          event={event}
          isDark={isDark}
          participantCount={participantCount}
          isJoined={isJoined}
          onClose={onClose}
          onSeeMore={onSeeMore}
          onJoin={onJoin}
        />
      </div>
    </Pane>
  );
}

export default function ExploreMap({
  isDark = true,
  center,
  events = [],
  participantCounts = {},
  joinedEventIds = new Set(),
  onMapClick,
  previewEvent,
  onEventSelect,
  onCloseEventPreview,
  onEventDetails,
  onJoinEvent,
  selectionMode = false,
  selectedLocation,
  onLocationSelect,
}) {
  const defaultCenter = POZNAN_CENTER;
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
        <MapClickHandler onMapClick={selectionMode ? onLocationSelect : onMapClick} />
        {!selectionMode && (
          <EventPreviewOverlay
            event={previewEvent}
            isDark={isDark}
            participantCount={
              previewEvent ? participantCounts[previewEvent.id] : undefined
            }
            isJoined={previewEvent ? joinedEventIds.has(previewEvent.id) : false}
            onClose={onCloseEventPreview}
            onSeeMore={onEventDetails}
            onJoin={onJoinEvent}
          />
        )}

        <TileLayer
          key={isDark ? 'dark-map-layer' : 'light-map-layer'}
          url={baseTileUrl}
          className={isDark ? '[filter:invert(100%)_hue-rotate(180deg)_brightness(0.88)_contrast(1.12)]' : ''}
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; OpenStreetMap'
          maxZoom={20}
        />

        {/* Динамические маркеры событий */}
        {selectionMode ? <SelectedLocationMarker position={selectedLocation} /> : events.map((evt) => (
          <Marker 
            key={evt.id} 
            position={[evt.lat, evt.lng]} 
            icon={createCustomIcon(evt.category || evt.type, isDark)}
            bubblingMouseEvents={false}
            eventHandlers={{ click: () => onEventSelect(evt) }}
          >
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}