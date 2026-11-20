import { useEffect, useRef, useState } from 'react';
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  MapPin,
  Moon,
  Search,
  Sun,
  X,
} from 'lucide-react';
import { EVENT_TYPES } from '../data/eventTypes';
import EventTypeSelect from './events/EventTypeSelect';

const navigationTabs = ['Explore Map', 'Chat', 'My Events', 'Friends', 'Settings'];

function formatDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateFilterLabel(value) {
  if (!value) return 'Choose date';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function FilterSwitch({ label, checked, onChange }) {
  return (
    <button
      aria-checked={checked}
      className="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
      onClick={() => onChange(!checked)}
      role="switch"
      type="button"
    >
      <span className="text-xs">{label}</span>
      <span
        aria-hidden="true"
        className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
          checked ? 'bg-[#e65a9c]' : 'bg-[#b8bbc2] dark:bg-[#4a515b]'
        }`}
      >
        <span
          className={`size-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  );
}

export function ThemeToggleButton({ isDark, onToggleTheme }) {
  return (
    <button
      type="button"
      onClick={onToggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      aria-pressed={isDark}
      className="flex h-[38px] cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 font-sans text-sm font-semibold text-[#262626] shadow-md transition-colors hover:bg-gray-50 max-[640px]:h-9 max-[640px]:w-9 max-[640px]:justify-center max-[640px]:px-0"
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4 text-amber-500" />
          <span className="max-[640px]:hidden">Light</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-indigo-500" />
          <span className="max-[640px]:hidden">Dark</span>
        </>
      )}
    </button>
  );
}

export default function AppHeader({
  activeTab,
  onTabChange,
  isDark,
  onToggleTheme,
  action = 'theme',
  fixed = false,
  onCitySelect,
  filters = {},
  onFilterChange,
  onClearFilters,
}) {
  const [locationQuery, setLocationQuery] = useState('Poznań, Poland');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isSearchingCities, setIsSearchingCities] = useState(false);
  const [citySearchError, setCitySearchError] = useState('');
  const [isCitySearchOpen, setIsCitySearchOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeDateField, setActiveDateField] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [draftDate, setDraftDate] = useState(() => new Date());
  const searchRequestId = useRef(0);
  const filtersPanelRef = useRef(null);

  useEffect(() => {
    const query = locationQuery.trim();
    if (!onCitySelect || query.length < 2 || !isCitySearchOpen) return undefined;

    const controller = new AbortController();
    const requestId = searchRequestId.current + 1;
    searchRequestId.current = requestId;
    const timeoutId = window.setTimeout(async () => {
      setIsSearchingCities(true);
      setCitySearchError('');

      try {
        const params = new URLSearchParams({
          q: query,
          limit: '6',
          lang: 'en',
          osm_tag: 'place:city',
        });
        params.append('osm_tag', 'place:town');
        const response = await fetch(
          `https://photon.komoot.io/api/?${params.toString()}`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error(`City search failed with status ${response.status}`);
        }

        const result = await response.json();
        if (searchRequestId.current !== requestId) return;
        const suggestions = (result.features || [])
          .map((feature) => {
            const properties = feature.properties || {};
            const [longitude, latitude] = feature.geometry?.coordinates || [];
            const cityName = properties.name || properties.city || properties.town;
            if (!cityName || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
              return null;
            }

            const label = [cityName, properties.state, properties.country]
              .filter((part, index, parts) => part && parts.indexOf(part) === index)
              .join(', ');
            return { label, coordinates: [latitude, longitude] };
          })
          .filter(Boolean)
          .filter(
            (suggestion, index, suggestionsList) =>
              suggestionsList.findIndex(
                (item) =>
                  item.label === suggestion.label &&
                  item.coordinates[0] === suggestion.coordinates[0] &&
                  item.coordinates[1] === suggestion.coordinates[1],
              ) === index,
          );
        setCitySuggestions(suggestions);
        setActiveSuggestionIndex(-1);
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('Unable to search for cities:', error);
        if (searchRequestId.current === requestId) {
          setCitySuggestions([]);
          setCitySearchError('Could not search cities. Please try again.');
        }
      } finally {
        if (!controller.signal.aborted && searchRequestId.current === requestId) {
          setIsSearchingCities(false);
        }
      }
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [locationQuery, isCitySearchOpen, onCitySelect]);

  useEffect(() => {
    if (!isFiltersOpen) return undefined;

    const handlePointerDown = (event) => {
      const categoryMenu = document.getElementById('header-event-category-options');
      if (
        !filtersPanelRef.current?.contains(event.target) &&
        !categoryMenu?.contains(event.target)
      ) {
        setIsFiltersOpen(false);
        setActiveDateField(null);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (activeDateField) setActiveDateField(null);
        else setIsFiltersOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeDateField, isFiltersOpen]);

  const selectCity = (city) => {
    setLocationQuery(city.label);
    setIsCitySearchOpen(false);
    setCitySuggestions([]);
    onCitySelect?.(city.coordinates);
  };

  const handleLocationKeyDown = (event) => {
    if (event.key === 'ArrowDown' && citySuggestions.length) {
      event.preventDefault();
      setActiveSuggestionIndex((index) => (index + 1) % citySuggestions.length);
    } else if (event.key === 'ArrowUp' && citySuggestions.length) {
      event.preventDefault();
      setActiveSuggestionIndex((index) =>
        index <= 0 ? citySuggestions.length - 1 : index - 1,
      );
    } else if (event.key === 'Enter' && citySuggestions.length) {
      event.preventDefault();
      selectCity(citySuggestions[Math.max(activeSuggestionIndex, 0)]);
    } else if (event.key === 'Escape') {
      setIsCitySearchOpen(false);
      setCitySuggestions([]);
    }
  };
  const activeFilterCount = [
    filters.category,
    filters.friendsOnly,
    filters.womenOnly,
    filters.startDate || filters.endDate,
  ].filter(Boolean).length;
  const monthFirstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const monthOffset = (monthFirstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + 1,
    0,
  ).getDate();
  const calendarDays = [
    ...Array.from({ length: monthOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  const monthName = new Intl.DateTimeFormat('en', { month: 'long' }).format(calendarMonth);
  const dateParts = {
    day: draftDate.getDate(),
    month: draftDate.getMonth(),
    year: draftDate.getFullYear(),
  };

  const openDateFilter = (field) => {
    const selectedDate = filters[field]
      ? new Date(`${filters[field]}T00:00:00`)
      : draftDate;
    setDraftDate(selectedDate);
    setCalendarMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    setActiveDateField(field);
  };

  return (
    <header
      className={`${fixed ? 'fixed' : 'relative'} top-0 right-0 left-0 z-30 flex h-[82px] shrink-0 items-start justify-between bg-[linear-gradient(180deg,rgba(18,20,20,.94)_0%,rgba(32,34,33,.72)_48%,rgba(32,34,33,.24)_78%,rgba(32,34,33,0)_100%)] px-8 pt-4 pointer-events-auto select-none backdrop-blur-[6px] max-[640px]:gap-[10px] max-[640px]:px-3`}
    >
      <div className="z-10 flex shrink-0 items-center gap-[30px] max-[640px]:gap-[10px]">
        <span className="font-sans text-[27px] leading-[140%] font-bold tracking-wide text-white max-[640px]:text-[20px]">
          ENJOINT
        </span>
        <div className="relative flex h-[46px] w-[330px] shrink-0 items-center gap-3 rounded-[24px] border border-gray-100 bg-[#F7F8FA] px-[18px] shadow-md transition-colors dark:border-white/5 dark:bg-[#1A212B] max-[640px]:w-[150px] max-[640px]:px-3">
          <Search className="h-4 w-4 shrink-0 text-[#AD316B] dark:text-[#FF7FC0]" />
          <input
            type="text"
            aria-label="Location"
            placeholder="Search for a city"
            value={locationQuery}
            autoComplete="off"
            aria-autocomplete={onCitySelect ? 'list' : undefined}
            aria-expanded={onCitySelect ? isCitySearchOpen : undefined}
            onFocus={() => setIsCitySearchOpen(true)}
            onChange={(event) => {
              setLocationQuery(event.target.value);
              setCitySuggestions([]);
              setIsSearchingCities(false);
              setCitySearchError('');
              setActiveSuggestionIndex(-1);
              setIsCitySearchOpen(true);
            }}
            onKeyDown={handleLocationKeyDown}
            className="w-full bg-transparent font-sans text-sm text-[#262626] outline-none placeholder:text-[#262626]/60 dark:text-white dark:placeholder:text-white/60"
          />
          <button
            type="button"
            aria-label="Clear location"
            onClick={() => {
              setLocationQuery('');
              setCitySuggestions([]);
              setIsSearchingCities(false);
              setCitySearchError('');
              setActiveSuggestionIndex(-1);
              setIsCitySearchOpen(true);
            }}
            className="cursor-pointer text-gray-400 hover:text-[#262626] dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
          {onCitySelect && isCitySearchOpen && locationQuery.trim().length >= 2 && (
            <div
              role="listbox"
              aria-label="City suggestions"
              className="absolute top-[calc(100%+8px)] left-0 z-50 max-h-72 w-full overflow-y-auto rounded-2xl border border-gray-200 bg-white py-1 shadow-xl dark:border-white/10 dark:bg-[#1A212B]"
            >
              {isSearchingCities ? (
                <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500 dark:text-white/60">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Searching cities...
                </div>
              ) : citySearchError ? (
                <p role="status" className="px-4 py-3 text-sm text-red-600 dark:text-red-300">
                  {citySearchError}
                </p>
              ) : citySuggestions.length ? (
                citySuggestions.map((city, index) => (
                  <button
                    key={`${city.label}-${city.coordinates.join(',')}`}
                    type="button"
                    role="option"
                    aria-selected={index === activeSuggestionIndex}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectCity(city)}
                    className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm text-[#262626] dark:text-white ${
                      index === activeSuggestionIndex
                        ? 'bg-[#FF7FC0]/20'
                        : 'hover:bg-[#FF7FC0]/10'
                    }`}
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-[#AD316B] dark:text-[#FF7FC0]" />
                    <span className="truncate">{city.label}</span>
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 text-sm text-gray-500 dark:text-white/60">
                  No cities found
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <nav
        className="absolute top-7 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-7 font-sans text-[15px] leading-none font-semibold min-[1024px]:flex"
        aria-label="Main navigation"
      >
        {navigationTabs.map((tab) => (
          onTabChange ? (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`cursor-pointer whitespace-nowrap transition-colors ${
                activeTab === tab ? 'text-[#FF7FC0]' : 'text-white hover:text-[#FF7FC0]'
              }`}
            >
              {tab}
            </button>
          ) : (
            <span
              key={tab}
              aria-current={activeTab === tab ? 'page' : undefined}
              className={`whitespace-nowrap transition-colors ${
                activeTab === tab ? 'text-[#FF7FC0]' : 'text-white'
              }`}
            >
              {tab}
            </span>
          )
        ))}
      </nav>

      <div className="relative z-10 flex shrink-0 items-center gap-5 max-[640px]:gap-[7px]">
        {action !== 'theme' && (
          <div className="relative" ref={filtersPanelRef}>
            <button
              type="button"
              aria-expanded={isFiltersOpen}
              aria-haspopup="dialog"
              aria-label={activeFilterCount ? `Filters, ${activeFilterCount} active` : 'Filters'}
              onClick={() => setIsFiltersOpen((open) => !open)}
              className="flex h-[38px] cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 font-sans text-sm font-semibold text-[#262626] shadow-md transition-colors hover:bg-gray-50 max-[640px]:h-9 max-[640px]:px-3 max-[640px]:text-xs"
            >
              <span>Filters{activeFilterCount ? ` (${activeFilterCount})` : ''}</span>
              <ChevronDown className={`h-4 w-4 text-[#262626] transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
            </button>
            {isFiltersOpen && onFilterChange && (
              <div
                aria-label="Event filters"
                className="absolute top-[calc(100%+10px)] right-0 z-50 w-[320px] max-w-[calc(100vw-24px)] rounded-2xl border border-gray-200 bg-white p-4 font-sans text-[#262626] shadow-2xl dark:border-white/10 dark:bg-[#1A212B] dark:text-white"
                role="dialog"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-sm font-bold">Event filters</h2>
                  <button
                    className="cursor-pointer text-xs font-medium text-[#ad316b] hover:underline dark:text-[#ff7fc0]"
                    onClick={() => {
                      onClearFilters();
                      setActiveDateField(null);
                    }}
                    type="button"
                  >
                    Clear all
                  </button>
                </div>

                <EventTypeSelect
                    id="header-event-category"
                    label="Event category"
                    isDark={isDark}
                    onChange={(category) =>
                      onFilterChange('category', category === 'All categories' ? '' : category)
                    }
                    options={['All categories', ...EVENT_TYPES]}
                    value={filters.category || 'All categories'}
                    variant="header"
                  />

                <div className="mt-4 grid gap-3">
                  <FilterSwitch
                    checked={Boolean(filters.friendsOnly)}
                    label="Friend's events"
                    onChange={(value) => onFilterChange('friendsOnly', value)}
                  />
                  <FilterSwitch
                    checked={Boolean(filters.womenOnly)}
                    label="Women only"
                    onChange={(value) => onFilterChange('womenOnly', value)}
                  />
                </div>

                <fieldset className="mt-4 grid grid-cols-2 gap-3">
                  <legend className="mb-2 text-xs font-medium">Date range</legend>
                  {[
                    ['startDate', 'From'],
                    ['endDate', 'To'],
                  ].map(([field, label]) => (
                    <div className="relative min-w-0" key={field}>
                      <span className="mb-1.5 block text-[11px] text-gray-500 dark:text-white/60">
                        {label}
                      </span>
                      <button
                        aria-label={`${label} date`}
                        aria-expanded={activeDateField === field}
                        className="flex h-9 w-full min-w-0 cursor-pointer items-center justify-between gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2 text-left text-[11px] text-[#262626] outline-none transition hover:border-[#ff7fc0] dark:border-white/10 dark:bg-[#202630] dark:text-white"
                        onClick={() => openDateFilter(field)}
                        type="button"
                      >
                        <span className="truncate">
                          {formatDateFilterLabel(filters[field])}
                        </span>
                        <CalendarDays className="h-4 w-4 shrink-0 text-[#ad316b] dark:text-[#ff7fc0]" />
                      </button>
                      {activeDateField === field && (
                        <div
                          aria-label={`${label} date calendar`}
                          className={`absolute top-[calc(100%+6px)] z-[70] w-[280px] rounded-2xl border p-4 shadow-2xl ${
                            field === 'endDate' ? 'right-0' : 'left-0'
                          } ${
                            isDark
                              ? 'border-white/10 bg-[#151a22] text-white'
                              : 'border-gray-200 bg-white text-[#262626]'
                          }`}
                          role="dialog"
                        >
                          <div className="flex min-h-[54px] items-center justify-between">
                            <button
                              aria-label="Previous month"
                              className="cursor-pointer rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10"
                              onClick={() =>
                                setCalendarMonth(
                                  (month) => new Date(month.getFullYear(), month.getMonth() - 1, 1),
                                )
                              }
                              type="button"
                            >
                              <ChevronLeft size={18} />
                            </button>
                            <div className="text-center">
                              <div className="text-2xl leading-none font-medium text-[#ff70b6]">
                                {calendarMonth.getFullYear()}
                              </div>
                              <div className="mt-1 text-xs text-[#ff70b6]">{monthName}</div>
                            </div>
                            <button
                              aria-label="Next month"
                              className="cursor-pointer rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10"
                              onClick={() =>
                                setCalendarMonth(
                                  (month) => new Date(month.getFullYear(), month.getMonth() + 1, 1),
                                )
                              }
                              type="button"
                            >
                              <ChevronRight size={18} />
                            </button>
                          </div>
                          <div
                            aria-label={`${monthName} ${calendarMonth.getFullYear()}`}
                            className="mt-2 grid grid-cols-7 justify-items-center gap-y-0.5"
                          >
                            {calendarDays.map((day, index) => {
                              if (day === null) {
                                return <span aria-hidden="true" key={`empty-${index}`} />;
                              }
                              const selected =
                                day === dateParts.day &&
                                calendarMonth.getMonth() === dateParts.month &&
                                calendarMonth.getFullYear() === dateParts.year;
                              return (
                                <button
                                  aria-label={new Date(
                                    calendarMonth.getFullYear(),
                                    calendarMonth.getMonth(),
                                    day,
                                  ).toLocaleDateString('en', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                  aria-pressed={selected}
                                  className="size-[32px] cursor-pointer rounded-full text-[11px] transition hover:bg-[#ff7fc0] hover:text-[#171717]"
                                  key={day}
                                  onClick={() =>
                                    setDraftDate(
                                      new Date(
                                        calendarMonth.getFullYear(),
                                        calendarMonth.getMonth(),
                                        day,
                                      ),
                                    )
                                  }
                                  style={{
                                    background: selected
                                      ? 'linear-gradient(135deg, #ff7fc0, #ff69b4)'
                                      : 'transparent',
                                    color: selected ? '#ffffff' : isDark ? '#ffffff' : '#171717',
                                    fontWeight: selected ? 600 : 400,
                                  }}
                                  type="button"
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                          <button
                            className="mt-4 h-10 w-full cursor-pointer rounded-full bg-gradient-to-r from-[#ff7fc0] to-[#ff813e] text-xs font-semibold text-white transition hover:brightness-105"
                            onClick={() => {
                              onFilterChange(field, formatDateInputValue(draftDate));
                              setActiveDateField(null);
                            }}
                            type="button"
                          >
                            Save
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </fieldset>
              </div>
            )}
          </div>
        )}
        <ThemeToggleButton isDark={isDark} onToggleTheme={onToggleTheme} />

        <div className="relative flex h-[40px] w-[43px] shrink-0 items-center justify-center max-[640px]:hidden">
          <div className="pointer-events-none absolute top-[-16px] left-0 z-20 h-[82px] w-[43px]">
            <svg width="43" height="82" viewBox="0 0 43 82" fill="none" aria-hidden="true">
              <path d="M1.5 0H41.5V80L21.5 68L1.5 80V0Z" fill="#AD316B" stroke="#FF7FC0" strokeWidth="3" />
              <line x1="13" y1="0" x2="13" y2="76" stroke="#FF7FC0" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="30" y1="0" x2="30" y2="76" stroke="#FF7FC0" strokeWidth="2" strokeDasharray="3 3" />
            </svg>
          </div>
        </div>

        <div className="flex h-[38px] w-[38px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white font-sans text-xs font-bold text-[#262626] shadow-md dark:border-[#FF7FC0]/40 dark:bg-[#2A1E2A] dark:text-[#FF7FC0] max-[640px]:h-[30px] max-[640px]:w-[30px]">
          AM
        </div>
      </div>
    </header>
  );
}
