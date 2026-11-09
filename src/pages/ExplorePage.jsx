import React, { useState, useEffect } from 'react';
import ExploreMap from '../components/ExploreMap';
import CreateEventModal from '../components/CreateEventModal';
import { Search, ChevronDown, Plus, MapPin, X, Sun, Moon } from 'lucide-react';

export default function ExplorePage({ isDark: propIsDark, setIsDark: propSetIsDark }) {
  const [localIsDark, setLocalIsDark] = useState(true);
  const isDark = propIsDark !== undefined ? propIsDark : localIsDark;

  const toggleTheme = () => {
    if (propSetIsDark) propSetIsDark(!isDark);
    else setLocalIsDark(!isDark);
  };

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const [userLocation, setUserLocation] = useState(null);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('Explore Map');

  // Модальное окно пошагового создания
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempCoords, setTempCoords] = useState(null);
  const [isPickingEventLocation, setIsPickingEventLocation] = useState(false);
  const [hasPickedEventLocation, setHasPickedEventLocation] = useState(false);
  const [pickedEventAddress, setPickedEventAddress] = useState('');
  const [isResolvingEventAddress, setIsResolvingEventAddress] = useState(false);
  const [eventAddressLookupFailed, setEventAddressLookupFailed] = useState(false);

  useEffect(() => {
    getUserLocation();
  }, []);

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
    const coordinates = [latlng.lat, latlng.lng];
    setTempCoords(coordinates);
    setPickedEventAddress('');
    setEventAddressLookupFailed(false);
    setIsResolvingEventAddress(true);

    if (isPickingEventLocation) {
      setIsPickingEventLocation(false);
      setHasPickedEventLocation(true);
      setIsModalOpen(true);
      return;
    }

    setHasPickedEventLocation(true);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setTempCoords(userLocation || [40.730610, -73.935242]);
    setHasPickedEventLocation(false);
    setPickedEventAddress('');
    setIsResolvingEventAddress(false);
    setEventAddressLookupFailed(false);
    setIsModalOpen(true);
  };

  const handlePickEventLocation = () => {
    setIsModalOpen(false);
    setIsPickingEventLocation(true);
  };

  const handleCancelPickingLocation = () => {
    setIsPickingEventLocation(false);
    setIsModalOpen(true);
  };

  const handleCreatedEvent = (newEvent) => {
    setEvents((prev) => [...prev, newEvent]);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans select-none">
      
      {/* 1. ИНТЕРАКТИВНАЯ КАРТА */}
      <div className="absolute inset-0 z-0">
        <ExploreMap 
          isDark={isDark} 
          center={userLocation}
          events={events}
          onMapClick={handleMapClick}
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
        
        {/* ВЕРХНЯЯ ШАПКА FIGMA */}
        <header
          className="fixed top-0 left-0 right-0 h-[82px] px-8 pt-4 flex items-start justify-between z-30 pointer-events-auto select-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(18,20,20,.94) 0%, rgba(32,34,33,.72) 48%, rgba(32,34,33,.24) 78%, rgba(32,34,33,0) 100%)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          
          <div className="flex items-center gap-[30px] shrink-0 z-10">
            <span className="font-sans font-bold text-[27px] leading-[140%] text-white tracking-wide">
              ENJOINT
            </span>

            <div className="w-[330px] h-[46px] rounded-[24px] px-[18px] flex items-center gap-[12px] bg-[#F7F8FA] dark:bg-[#1A212B] shrink-0 shadow-md border border-gray-100 dark:border-white/5 transition-colors">
              <Search className="w-4 h-4 text-[#AD316B] dark:text-[#FF7FC0] shrink-0" />
              <input 
                type="text" 
                placeholder="New York, NY" 
                className="w-full bg-transparent outline-none font-sans text-sm text-[#262626] dark:text-white placeholder-[#262626]/60 dark:placeholder-white/60"
              />
              <button className="text-gray-400 hover:text-[#262626] dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-7 font-sans font-semibold text-[15px] leading-none absolute left-1/2 -translate-x-1/2 top-7 z-10">
            {['Explore Map', 'Chat', 'My Events', 'Friends', 'Settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab ? 'text-[#FF7FC0]' : 'text-white hover:text-[#FF7FC0]'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-5 shrink-0 relative z-10">
            <button className="h-[38px] px-4 rounded-full bg-white text-[#262626] font-sans font-semibold text-sm flex items-center gap-1.5 shadow-md hover:bg-gray-50 transition-colors cursor-pointer">
              <span>Filters</span>
              <ChevronDown className="w-4 h-4 text-[#262626]" />
            </button>

            <div className="w-[43px] h-[40px] relative flex items-center justify-center shrink-0">
              <div className="absolute top-[-28px] left-0 w-[43px] h-[150px] pointer-events-none z-20">
                <svg width="43" height="150" viewBox="0 0 43 150" fill="none">
                  <path d="M1.5 0H41.5V140L21.5 124L1.5 140V0Z" fill="#AD316B" stroke="#FF7FC0" strokeWidth="3"/>
                  <line x1="13" y1="0" x2="13" y2="130" stroke="#FF7FC0" strokeWidth="2" strokeDasharray="3 3"/>
                  <line x1="30" y1="0" x2="30" y2="130" stroke="#FF7FC0" strokeWidth="2" strokeDasharray="3 3"/>
                </svg>
              </div>
            </div>

            <div className="w-[38px] h-[38px] rounded-full bg-white dark:bg-[#2A1E2A] border border-gray-200 dark:border-[#FF7FC0]/40 flex items-center justify-center font-sans font-bold text-xs text-[#262626] dark:text-[#FF7FC0] shadow-md cursor-pointer shrink-0">
              AM
            </div>
          </div>
        </header>

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

      {/* 3. ПОШАГОВОЕ МОДАЛЬНОЕ ОКНО СОЗДАНИЯ ИВЕНТА И УСПЕХА */}
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
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

    </div>
  );
}