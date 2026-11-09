import React, { useState, useEffect } from 'react';
import ExploreMap from '../components/ExploreMap';
import { Search, ChevronDown, Plus, MapPin, X, Camera, Utensils, Coffee, Music, Flame, Sun, Moon } from 'lucide-react';

export default function ExplorePage({ isDark: propIsDark, setIsDark: propSetIsDark }) {
  // Локальный state + фоллбек на внешние пропсы
  const [localIsDark, setLocalIsDark] = useState(true);
  const isDark = propIsDark !== undefined ? propIsDark : localIsDark;

  const toggleTheme = () => {
    if (propSetIsDark) {
      propSetIsDark(!isDark);
    } else {
      setLocalIsDark(!isDark);
    }
  };

  // Переключение класса 'dark' на корневом <html> для стилей Tailwind
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const [userLocation, setUserLocation] = useState(null);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('Explore Map');

  // Модальное окно создания события
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempCoords, setTempCoords] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState('party');

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.warn('Геолокация недоступна:', error.message)
      );
    }
  };

  const handleMapClick = (latlng) => {
    setTempCoords([latlng.lat, latlng.lng]);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setTempCoords(userLocation || [40.730610, -73.935242]);
    setIsModalOpen(true);
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const newEvent = {
      id: Date.now(),
      title: eventTitle,
      type: eventType,
      lat: tempCoords[0],
      lng: tempCoords[1],
    };

    setEvents((prev) => [...prev, newEvent]);
    setEventTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans select-none">
      
      {/* 1. КАРТА НА ВЕСЬ ЭКРАН */}
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
        
        {/* =========================================================================
           ВЕРХНЯЯ ШАПКА FIGMA (1600x80px С МЯГКОЙ МАСКОЙ И БЛЮРОМ)
           ========================================================================= */}
        <header className="fixed top-0 left-0 right-0 h-[110px] px-8 pt-4 flex items-start justify-between z-30 pointer-events-auto select-none bg-gradient-to-b from-[rgba(9,11,18,0.85)] via-[rgba(9,11,18,0.4)] to-transparent backdrop-blur-[12px] [mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)]">
          
          {/* СЛЕВА: ЛОГОТИП + ПОИСК (330x46px) */}
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
              <button className="text-gray-400 hover:text-[#262626] dark:hover:text-white shrink-0 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ЦЕНТР: ССЫЛКИ НАВИГАЦИИ (Центрированы) */}
          <nav className="hidden lg:flex items-center gap-7 font-sans font-semibold text-[15px] leading-none absolute left-1/2 -translate-x-1/2 top-7 z-10">
            {['Explore Map', 'Chat', 'My Events', 'Friends', 'Settings'].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`transition-colors cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? 'text-[#FF7FC0]' 
                      : 'text-white hover:text-[#FF7FC0]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </nav>

          {/* СПРАВА: FILTERS -> РОЗОВАЯ ЛЕНТА -> АВАТАР AM */}
          <div className="flex items-center gap-5 shrink-0 relative z-10">
            
            <button className="h-[38px] px-4 rounded-full bg-white text-[#262626] font-sans font-semibold text-sm flex items-center gap-1.5 shadow-md hover:bg-gray-50 transition-colors cursor-pointer">
              <span>Filters</span>
              <ChevronDown className="w-4 h-4 text-[#262626]" />
            </button>

            {/* Лента-закладка из Figma (43x150px) */}
            <div className="w-[43px] h-[40px] relative flex items-center justify-center shrink-0">
              <div className="absolute top-[-28px] left-0 w-[43px] h-[150px] pointer-events-none z-20">
                <svg width="43" height="150" viewBox="0 0 43 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M1.5 0H41.5V140L21.5 124L1.5 140V0Z" 
                    fill="#AD316B" 
                    stroke="#FF7FC0" 
                    strokeWidth="3"
                  />
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

        {/* РОЗОВЫЙ ПЛЮС СОЗДАНИЯ СОБЫТИЯ */}
        <button 
          onClick={handleOpenAddModal}
          className="fixed top-[96px] right-8 w-12 h-12 rounded-full bg-gradient-to-r from-[#ff7fc0] to-[#ff813e] text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer pointer-events-auto z-20"
        >
          <Plus className="w-6 h-6" />
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
              <button 
                onClick={getUserLocation} 
                className="text-gray-900 dark:text-white underline hover:opacity-80"
              >
                Use my location
              </button>
              <button className="text-gray-500 dark:text-white/60 hover:underline">
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

            {/* КНОПКА ПЕРЕКЛЮЧЕНИЯ ТЕМЫ */}
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

          <div className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#11161D]/80 border border-gray-100 dark:border-white/10 backdrop-blur-md shadow-md font-mono text-[11px] transition-colors">
            1km
          </div>
        </footer>

      </div>

      {/* МОДАЛЬНОЕ ОКНО СОЗДАНИЯ СОБЫТИЯ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 pointer-events-auto">
          <div className="bg-white dark:bg-[#11161D] border border-gray-200 dark:border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl text-gray-900 dark:text-white relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4">Create New Event</h2>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-white/60 mb-1">
                  Event Title
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Night Party, Coffee Break"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-100 dark:bg-[#1b222c] border border-gray-200 dark:border-white/10 outline-none text-sm text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-white/60 mb-2">
                  Select Category / Icon
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { type: 'party', icon: Flame, label: 'Party' },
                    { type: 'music', icon: Music, label: 'Music' },
                    { type: 'coffee', icon: Coffee, label: 'Coffee' },
                    { type: 'food', icon: Utensils, label: 'Food' },
                    { type: 'photo', icon: Camera, label: 'Photo' },
                  ].map((item) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => setEventType(item.type)}
                        className={`flex flex-col items-center p-3 rounded-2xl border transition-all cursor-pointer ${
                          eventType === item.type
                            ? 'bg-[#ff7fc0]/20 border-[#ff7fc0] text-[#ff7fc0]'
                            : 'border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/60 hover:border-gray-400'
                        }`}
                      >
                        <IconComp className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#ff7fc0] to-[#ff813e] text-white font-medium text-sm hover:opacity-95 transition-opacity mt-2 cursor-pointer"
              >
                Add Event to Map
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}