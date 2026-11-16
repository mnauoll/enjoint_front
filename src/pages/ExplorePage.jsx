import React, { useState, useEffect } from 'react';
import ExploreMap from '../components/ExploreMap';
import CreateEventModal from '../components/CreateEventModal';
import AppHeader from '../components/AppHeader';
import { Plus, MapPin, Sun, Moon } from 'lucide-react';
import { DEMO_EVENTS, POZNAN_CENTER } from '../data/demoEvents';
import EventDetailsPanel from '../components/events/EventDetailsPanel';
import EventJoinedDialog from '../components/events/EventJoinedDialog';
import {
  getEventCapacity,
  getEventParticipantCount,
} from '../components/events/eventUtils';

export default function ExplorePage({
  isDark: propIsDark,
  setIsDark: propSetIsDark,
  activeTab: propActiveTab,
  onTabChange: propOnTabChange,
  events: propEvents,
  joinedEventIds: propJoinedEventIds,
  onCreatedEvent: propOnCreatedEvent,
  onJoinEvent: propOnJoinEvent,
  onOpenChat: propOnOpenChat,
  shouldOpenCreateEvent = false,
  onCreateEventRequestHandled,
}) {
  const [localIsDark, setLocalIsDark] = useState(true);
  const isDark = propIsDark !== undefined ? propIsDark : localIsDark;
  const [localActiveTab, setLocalActiveTab] = useState('Explore Map');
  const activeTab = propActiveTab ?? localActiveTab;
  const changeTab = propOnTabChange ?? setLocalActiveTab;

  const toggleTheme = () => {
    if (propSetIsDark) propSetIsDark(!isDark);
    else setLocalIsDark(!isDark);
  };

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const [userLocation, setUserLocation] = useState(null);
  const [localEvents, setLocalEvents] = useState(DEMO_EVENTS);
  const events = propEvents ?? localEvents;
  const [previewEvent, setPreviewEvent] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  const [participantCounts, setParticipantCounts] = useState({});
  const [localJoinedEventIds, setLocalJoinedEventIds] = useState(() => new Set());
  const joinedEventIds = propJoinedEventIds ?? localJoinedEventIds;
  const [joinedEvent, setJoinedEvent] = useState(null);

  // Модальное окно пошагового создания
  const [isLocallyModalOpen, setIsLocallyModalOpen] = useState(false);
  const isModalOpen = isLocallyModalOpen || shouldOpenCreateEvent;
  const [tempCoords, setTempCoords] = useState(null);
  const [isPickingEventLocation, setIsPickingEventLocation] = useState(false);
  const [hasPickedEventLocation, setHasPickedEventLocation] = useState(false);
  const [pickedEventAddress, setPickedEventAddress] = useState('');
  const [isResolvingEventAddress, setIsResolvingEventAddress] = useState(false);
  const [eventAddressLookupFailed, setEventAddressLookupFailed] = useState(false);

  useEffect(() => {
    if (!isResolvingEventAddress || !tempCoords) return undefined;

    const controller = new AbortController();
    const [lat, lon] = tempCoords;

    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      { signal: controller.signal },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Address lookup failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        const address = result.address || {};
        const street = [address.road || address.pedestrian || address.footway, address.house_number]
          .filter(Boolean)
          .join(' ');
        const city =
          address.city || address.town || address.village || address.municipality || address.suburb;
        const formattedAddress = [street, city].filter(Boolean).join(', ') || result.display_name;

        if (!formattedAddress) throw new Error('No address found for the selected map point');

        setPickedEventAddress(formattedAddress);
        setEventAddressLookupFailed(false);
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        console.error('Unable to resolve selected event location:', error);
        setPickedEventAddress('');
        setEventAddressLookupFailed(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsResolvingEventAddress(false);
      });

    return () => controller.abort();
  }, [isResolvingEventAddress, tempCoords]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation([position.coords.latitude, position.coords.longitude]),
        (error) => console.warn('Геолокация недоступна:', error.message)
      );
    }
  };

  const handleMapClick = (latlng) => {
    setPreviewEvent(null);
    setActiveEvent(null);
    const coordinates = [latlng.lat, latlng.lng];
    setTempCoords(coordinates);
    setPickedEventAddress('');
    setEventAddressLookupFailed(false);
    setIsResolvingEventAddress(true);

    if (isPickingEventLocation) {
      setIsPickingEventLocation(false);
      setHasPickedEventLocation(true);
      setIsLocallyModalOpen(true);
      return;
    }

    setHasPickedEventLocation(true);
    setIsLocallyModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setPreviewEvent(null);
    setActiveEvent(null);
    setTempCoords(userLocation || POZNAN_CENTER);
    setHasPickedEventLocation(false);
    setPickedEventAddress('');
    setIsResolvingEventAddress(false);
    setEventAddressLookupFailed(false);
    setIsLocallyModalOpen(true);
  };

  const handlePickEventLocation = () => {
    setIsLocallyModalOpen(false);
    onCreateEventRequestHandled?.();
    setIsPickingEventLocation(true);
  };

  const handleCancelPickingLocation = () => {
    setIsPickingEventLocation(false);
    setIsLocallyModalOpen(true);
    onCreateEventRequestHandled?.();
  };

  const handleCreatedEvent = (newEvent) => {
    if (propOnCreatedEvent) {
      propOnCreatedEvent(newEvent);
    } else {
      setLocalEvents((prev) => [...prev, newEvent]);
    }
  };

  const handleJoinEvent = (event) => {
    if (joinedEventIds.has(event.id)) return;

    const participantCount =
      participantCounts[event.id] ?? getEventParticipantCount(event);
    if (participantCount >= getEventCapacity(event)) return;

    const joinedCount = participantCount + 1;
    setParticipantCounts((counts) => ({ ...counts, [event.id]: joinedCount }));
    if (propOnJoinEvent) {
      propOnJoinEvent(event);
    } else {
      setLocalJoinedEventIds((ids) => new Set(ids).add(event.id));
    }
    setPreviewEvent(null);
    setActiveEvent(null);
    setJoinedEvent({ ...event, joinedCount });
  };

  const handleEventDetails = (event) => {
    setPreviewEvent(null);
    setActiveEvent(event);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans select-none">
      
      {/* 1. ИНТЕРАКТИВНАЯ КАРТА */}
      <div className="absolute inset-0 z-0">
        <ExploreMap 
          isDark={isDark} 
          center={userLocation || POZNAN_CENTER}
          events={events}
          participantCounts={participantCounts}
          joinedEventIds={joinedEventIds}
          previewEvent={previewEvent}
          onMapClick={handleMapClick}
          onEventSelect={(event) => {
            setActiveEvent(null);
            setPreviewEvent(event);
          }}
          onCloseEventPreview={() => setPreviewEvent(null)}
          onEventDetails={handleEventDetails}
          onJoinEvent={handleJoinEvent}
        />
      </div>

      {/* 2. UI СЛОЙ ПОВЕРХ КАРТЫ */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 pointer-events-none">
        {isPickingEventLocation && (
          <div className="fixed top-28 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-full border border-white/15 bg-[#11161D]/95 px-5 py-3 text-sm text-white shadow-2xl backdrop-blur-md pointer-events-auto">
            <span>Click on the map to pick an event location</span>
            <button
              className="text-white/70 underline hover:text-white"
              onClick={handleCancelPickingLocation}
              type="button"
            >
              Cancel
            </button>
          </div>
        )}
        
        <AppHeader
          fixed
          activeTab={activeTab}
          onTabChange={changeTab}
          isDark={isDark}
        />

        {/* НАЖАТИЕ НА ЭТОТ РОЗОВЫЙ ПЛЮСИК ОТКРЫВАЕТ ВЕСЬ МАСТЕР 1/5 */}
        <button 
          onClick={handleOpenAddModal}
          className="fixed top-[96px] right-8 w-12 h-12 rounded-full bg-gradient-to-r from-[#ff7fc0] to-[#ff813e] text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer pointer-events-auto z-20"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* ПЛАШКА ЛОКАЦИИ */}
        <div className="mt-[96px] pointer-events-auto w-80 p-5 rounded-3xl bg-white/95 dark:bg-[#11161D]/90 border border-gray-100 dark:border-white/10 shadow-2xl backdrop-blur-md flex gap-3 transition-colors">
          <div className="w-8 h-8 rounded-full bg-[#ff7fc0]/15 flex items-center justify-center shrink-0 text-[#ff7fc0]">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Find events close to you</h3>
            <p className="text-xs text-gray-500 dark:text-white/60 mt-1 leading-snug">
              Allow location access, or search a city above.
            </p>
            <div className="flex items-center gap-3 mt-3 text-xs font-medium">
              <button onClick={getUserLocation} className="text-gray-900 dark:text-white underline hover:opacity-80 cursor-pointer">
                Use my location
              </button>
              <button className="text-gray-500 dark:text-white/60 hover:underline cursor-pointer">
                Enter manually
              </button>
            </div>
          </div>
        </div>

        {/* НИЖНЯЯ ПАНЕЛЬ С КНОПКОЙ ТЕМЫ */}
        <footer className="flex items-center justify-between w-full pointer-events-auto text-xs text-gray-600 dark:text-white/70">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-[#11161D]/80 border border-gray-100 dark:border-white/10 backdrop-blur-md shadow-md transition-colors">
              <span className="w-2 h-2 rounded-full bg-[#ff7fc0] animate-pulse"></span>
              <span className="font-medium text-gray-900 dark:text-white">
                {events.length} {events.length === 1 ? 'event' : 'events'} in this area
              </span>
              <span className="text-gray-400 dark:text-white/40">Select a dot or click map to add</span>
            </div>

            <button 
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/90 dark:bg-[#11161D]/80 border border-gray-100 dark:border-white/10 backdrop-blur-md shadow-md text-xs font-semibold text-gray-900 dark:text-white hover:scale-105 transition-all cursor-pointer"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#11161D]/80 border border-gray-100 dark:border-white/10 backdrop-blur-md shadow-md font-mono text-[11px]">
            1km
          </div>
        </footer>

      </div>

      {activeEvent && (
        <EventDetailsPanel
          key={activeEvent.id}
          event={activeEvent}
          isDark={isDark}
          participantCount={
            participantCounts[activeEvent.id] ??
            getEventParticipantCount(activeEvent)
          }
          isJoined={joinedEventIds.has(activeEvent.id)}
          onClose={() => setActiveEvent(null)}
          onJoin={handleJoinEvent}
        />
      )}

      {/* 3. ПОШАГОВОЕ МОДАЛЬНОЕ ОКНО СОЗДАНИЯ ИВЕНТА И УСПЕХА */}
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsLocallyModalOpen(false);
          onCreateEventRequestHandled?.();
          setIsPickingEventLocation(false);
        }}
        onCreatedEvent={handleCreatedEvent}
        initialCoords={tempCoords}
        onPickLocation={handlePickEventLocation}
        pickedLocation={hasPickedEventLocation}
        pickedLocationAddress={pickedEventAddress}
        isResolvingLocationAddress={isResolvingEventAddress}
        locationAddressLookupFailed={eventAddressLookupFailed}
      />

      {joinedEvent && (
        <EventJoinedDialog
          event={joinedEvent}
          isDark={isDark}
          onClose={() => setJoinedEvent(null)}
          onOpenChat={() => {
            setJoinedEvent(null);
            propOnOpenChat?.(joinedEvent);
          }}
        />
      )}

    </div>
  );
}