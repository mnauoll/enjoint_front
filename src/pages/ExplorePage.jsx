import React, { useState, useEffect, useRef } from 'react';
import ExploreMap from '../components/ExploreMap';
import CreateEventModal from '../components/CreateEventModal';
import AppHeader from '../components/AppHeader';
import { Plus, MapPin } from 'lucide-react';
import { DEMO_EVENTS, POZNAN_CENTER } from '../data/demoEvents';
import EventDetailsPanel from '../components/events/EventDetailsPanel';
import EventJoinedDialog from '../components/events/EventJoinedDialog';
import {
  getEventCapacity,
  getEventDate,
  getEventParticipantCount,
} from '../components/events/eventUtils';
import { DEMO_FRIENDS } from '../data/demoFriends';

const DEMO_FRIEND_NAMES = new Set(DEMO_FRIENDS.map((friend) => friend.name.toLowerCase()));

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

  const [mapCenter, setMapCenter] = useState(POZNAN_CENTER);
  const [localEvents, setLocalEvents] = useState(DEMO_EVENTS);
  const events = propEvents ?? localEvents;
  const [filters, setFilters] = useState({
    category: '',
    friendsOnly: false,
    womenOnly: false,
    startDate: '',
    endDate: '',
  });
  const [previewEvent, setPreviewEvent] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  const [participantCounts, setParticipantCounts] = useState({});
  const [localJoinedEventIds, setLocalJoinedEventIds] = useState(() => new Set());
  const joinedEventIds = propJoinedEventIds ?? localJoinedEventIds;
  const [joinedEvent, setJoinedEvent] = useState(null);
  const filteredEvents = events.filter((event) => {
    if (filters.category && (event.category || event.type) !== filters.category) return false;
    if (
      filters.friendsOnly &&
      !DEMO_FRIEND_NAMES.has(String(event.host || '').trim().toLowerCase())
    ) {
      return false;
    }
    if (filters.womenOnly && !event.womenOnly) return false;

    if (filters.startDate || filters.endDate) {
      const eventDate = getEventDate(event);
      if (!eventDate) return false;
      const startDate = filters.startDate ? new Date(`${filters.startDate}T00:00:00`) : null;
      const endDate = filters.endDate ? new Date(`${filters.endDate}T00:00:00`) : null;
      eventDate.setHours(0, 0, 0, 0);
      if (startDate && eventDate < startDate) return false;
      if (endDate && eventDate > endDate) return false;
    }

    return true;
  });

  const handleEventFilterChange = (field, value) => {
    setFilters((currentFilters) => {
      const nextFilters = { ...currentFilters, [field]: value };
      if (
        field === 'startDate' &&
        nextFilters.endDate &&
        value > nextFilters.endDate
      ) {
        nextFilters.endDate = value;
      } else if (
        field === 'endDate' &&
        nextFilters.startDate &&
        value < nextFilters.startDate
      ) {
        nextFilters.startDate = value;
      }
      return nextFilters;
    });
    setPreviewEvent(null);
    setActiveEvent(null);
  };

  const handleClearEventFilters = () => {
    setFilters({
      category: '',
      friendsOnly: false,
      womenOnly: false,
      startDate: '',
      endDate: '',
    });
    setPreviewEvent(null);
    setActiveEvent(null);
  };

  // Модальное окно пошагового создания
  const [isLocallyModalOpen, setIsLocallyModalOpen] = useState(false);
  const isModalOpen = isLocallyModalOpen || shouldOpenCreateEvent;
  const [tempCoords, setTempCoords] = useState(null);
  const [isPickingEventLocation, setIsPickingEventLocation] = useState(false);
  const [hasPickedEventLocation, setHasPickedEventLocation] = useState(false);
  const [pickedEventAddress, setPickedEventAddress] = useState('');
  const [isResolvingEventAddress, setIsResolvingEventAddress] = useState(false);
  const [eventAddressLookupFailed, setEventAddressLookupFailed] = useState(false);
  const [isCreateHintVisible, setIsCreateHintVisible] = useState(false);
  const createHintTimeoutRef = useRef(null);

  useEffect(
    () => () => {
      if (createHintTimeoutRef.current) {
        clearTimeout(createHintTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!isResolvingEventAddress || !tempCoords) return undefined;

    const controller = new AbortController();
    const [lat, lon] = tempCoords;

    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&accept-language=en`,
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
        (position) => setMapCenter([position.coords.latitude, position.coords.longitude]),
        (error) => console.warn('Геолокация недоступна:', error.message)
      );
    }
  };

  const handleMapClick = (latlng) => {
    if (isPickingEventLocation) {
      const coordinates = [latlng.lat, latlng.lng];
      setTempCoords(coordinates);
      setPickedEventAddress('');
      setEventAddressLookupFailed(false);
      setIsResolvingEventAddress(true);
      setIsPickingEventLocation(false);
      setHasPickedEventLocation(true);
      setIsLocallyModalOpen(true);
      return;
    }

    setPreviewEvent(null);
    setActiveEvent(null);
    setIsCreateHintVisible(true);
    if (createHintTimeoutRef.current) {
      clearTimeout(createHintTimeoutRef.current);
    }
    createHintTimeoutRef.current = window.setTimeout(() => {
      setIsCreateHintVisible(false);
      createHintTimeoutRef.current = null;
    }, 2200);
  };

  const handleOpenAddModal = () => {
    setIsCreateHintVisible(false);
    if (createHintTimeoutRef.current) {
      clearTimeout(createHintTimeoutRef.current);
      createHintTimeoutRef.current = null;
    }
    setPreviewEvent(null);
    setActiveEvent(null);
    setTempCoords(mapCenter);
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

  const handleOpenMyEvents = () => {
    setIsLocallyModalOpen(false);
    onCreateEventRequestHandled?.();
    setIsPickingEventLocation(false);
    changeTab('My Events');
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
          center={mapCenter}
          events={filteredEvents}
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
          action="filters"
          onToggleTheme={toggleTheme}
          filters={filters}
          onFilterChange={handleEventFilterChange}
          onClearFilters={handleClearEventFilters}
          onCitySelect={(coordinates) => {
            setMapCenter(coordinates);
            setPreviewEvent(null);
            setActiveEvent(null);
          }}
        />

        {/* НАЖАТИЕ НА ЭТОТ РОЗОВЫЙ ПЛЮСИК ОТКРЫВАЕТ ВЕСЬ МАСТЕР 1/5 */}
        <button 
          onClick={handleOpenAddModal}
          className="fixed top-[96px] right-8 w-12 h-12 rounded-full bg-gradient-to-r from-[#ff7fc0] to-[#ff813e] text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer pointer-events-auto z-20"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
        <div
          aria-hidden={!isCreateHintVisible}
          aria-live="polite"
          className={`pointer-events-none fixed top-[152px] right-14 z-30 flex flex-col items-end gap-1 transition-[opacity,transform] duration-500 ease-out ${
            isCreateHintVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
          }`}
          role="status"
        >
          <svg
            aria-hidden="true"
            className="absolute -top-10 right-[-6px] h-10 w-10 animate-pulse drop-shadow-md"
            fill="none"
            viewBox="0 0 40 40"
          >
            <defs>
              <linearGradient id="create-event-arrow-gradient" x1="4" y1="36" x2="34" y2="5">
                <stop stopColor="#ff813e" />
                <stop offset="1" stopColor="#ff7fc0" />
              </linearGradient>
            </defs>
            <path
              d="M4 36C7 23 17 10 34 5M22 5H34V17"
              stroke="url(#create-event-arrow-gradient)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
          </svg>
          <div className="rounded-full border border-[#ff7fc0]/30 bg-white/95 px-4 py-2 text-xs font-semibold text-[#262626] shadow-xl backdrop-blur-md dark:bg-[#11161D]/95 dark:text-white">
            Tap + to create an event
          </div>
        </div>

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
            </div>
          </div>
        </div>

        {/* НИЖНЯЯ ПАНЕЛЬ С КНОПКОЙ ТЕМЫ */}
        <footer className="flex items-center justify-between w-full pointer-events-auto text-xs text-gray-600 dark:text-white/70">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-[#11161D]/80 border border-gray-100 dark:border-white/10 backdrop-blur-md shadow-md transition-colors">
              <span className="w-2 h-2 rounded-full bg-[#ff7fc0] animate-pulse"></span>
              <span className="font-medium text-gray-900 dark:text-white">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} in this area
              </span>
              <span className="text-gray-400 dark:text-white/40">Select a dot or click map to add</span>
            </div>

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
        onOpenMyEvents={handleOpenMyEvents}
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