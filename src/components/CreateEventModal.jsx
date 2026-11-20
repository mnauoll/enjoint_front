import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ImagePlus,
  MapPin,
  X,
} from 'lucide-react';
import { EVENT_TYPES } from '../data/eventTypes';

const STEPS = ['Basics', 'Date & time', 'Location', 'People', 'Review'];
const EMPTY_EVENT_FORM = {
  title: '',
  description: '',
  date: '',
  time: '',
  city: '',
  address: '',
  people: '',
  type: '',
  womenOnly: false,
  comments: '',
  photo: null,
};
const INPUT_CLASS =
  'w-full rounded-full border border-transparent bg-[#f1f3f5] px-4 text-xs text-[#262626] outline-none transition placeholder:text-[#858991] focus:border-[#ff7fc0] focus:ring-2 focus:ring-[#ff7fc0]/20 dark:bg-[#202630] dark:text-white dark:placeholder:text-white/45';
const LABEL_CLASS = 'block font-medium text-[#686b73] dark:text-white/65';

function getLocalDateParts(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };
}

function parseEventDate(value) {
  const [day, month, year] = value.split('.').map(Number);
  if (!day || !month || !year) return null;
  const parsed = new Date(year, month - 1, day);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }
  return parsed;
}

function getTodayDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function formatEventDate(date) {
  const { year, month, day } = getLocalDateParts(date);
  return `${String(day).padStart(2, '0')}.${String(month + 1).padStart(2, '0')}.${year}`;
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  isDark,
  type = 'text',
  min,
  inputMode,
  required = false,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(2px, .22vw, 4px)' }}>
      <label
        className={LABEL_CLASS}
        htmlFor={id}
        style={{
          margin: 0,
          color: isDark ? '#a6abb4' : '#686b73',
          fontSize: 'clamp(10px, .58vw, 11px)',
          lineHeight: 1.35,
        }}
      >
        {label}
      </label>
      <input
        className={INPUT_CLASS}
        id={id}
        aria-required={required}
        inputMode={inputMode}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isFocused ? '' : placeholder}
        style={{
          appearance: 'none',
          boxSizing: 'border-box',
          width: '100%',
          height: 'clamp(36px, 2.12vw, 40px)',
          padding: '0 clamp(12px, .85vw, 16px)',
          border: `1px solid ${isDark ? '#ffffff12' : '#e8e9ec'}`,
          borderRadius: 999,
          backgroundColor: isDark ? '#202630' : '#f1f3f5',
          color: isDark ? '#ffffff' : '#262626',
          fontSize: 'clamp(11px, .64vw, 12px)',
          lineHeight: 1.3,
          outline: 'none',
        }}
        type={type}
        value={value}
      />
    </div>
  );
}

function SelectField({ id, label, value, onChange, options, isDark, required = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (
        !containerRef.current?.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const updateMenuPosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const gap = 6;
      const viewportPadding = 8;
      const spaceBelow = window.innerHeight - rect.bottom - gap - viewportPadding;
      const spaceAbove = rect.top - gap - viewportPadding;
      const openAbove = spaceBelow < 160 && spaceAbove > spaceBelow;
      const availableHeight = Math.max(0, openAbove ? spaceAbove : spaceBelow);
      const maxHeight = Math.min(220, availableHeight);

      setMenuPosition({
        left: rect.left,
        top: openAbove ? Math.max(viewportPadding, rect.top - gap - maxHeight) : rect.bottom + gap,
        width: rect.width,
        maxHeight,
      });
    };

    updateMenuPosition();
    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);
    return () => {
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const optionIndex = options.indexOf(value);
    const option = menuRef.current?.querySelectorAll('[role="option"]')[
      optionIndex >= 0 ? optionIndex : 0
    ];
    option?.focus();
  }, [isOpen, options, value]);

  const moveFocus = (event, direction) => {
    const optionElements = Array.from(
      menuRef.current?.querySelectorAll('[role="option"]') || [],
    );
    const currentIndex = optionElements.indexOf(event.currentTarget);
    const nextIndex = (currentIndex + direction + optionElements.length) % optionElements.length;
    optionElements[nextIndex]?.focus();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(2px, .22vw, 4px)' }}>
      <label
        className={LABEL_CLASS}
        htmlFor={id}
        id={`${id}-label`}
        style={{
          margin: 0,
          color: isDark ? '#a6abb4' : '#686b73',
          fontSize: 'clamp(10px, .58vw, 11px)',
          lineHeight: 1.35,
        }}
      >
        {label}
      </label>
      <div ref={containerRef} style={{ position: 'relative' }}>
        <button
          aria-controls={`${id}-options`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-required={required}
          className={INPUT_CLASS}
          onClick={() => setIsOpen((open) => !open)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              setIsOpen(true);
            } else if (event.key === 'Escape' && isOpen) {
              event.preventDefault();
              event.stopPropagation();
              setIsOpen(false);
            }
          }}
          ref={triggerRef}
          id={id}
          style={{
            appearance: 'none',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: 'clamp(36px, 2.12vw, 40px)',
            padding: '0 38px 0 clamp(12px, .85vw, 16px)',
            border: `1px solid ${isDark ? '#ffffff12' : '#e8e9ec'}`,
            borderRadius: 999,
            backgroundColor: isDark ? '#202630' : '#f1f3f5',
            color: value ? (isDark ? '#ffffff' : '#262626') : (isDark ? 'rgba(255,255,255,.4)' : '#858991'),
            fontSize: 'clamp(11px, .64vw, 12px)',
            textAlign: 'left',
            cursor: 'pointer',
            outline: 'none',
          }}
          type="button"
        >
          <span>{value || 'Select a type'}</span>
        </button>
        <ChevronDown
          aria-hidden="true"
          size={15}
          style={{
            position: 'absolute',
            top: '50%',
            right: 14,
            transform: 'translateY(-50%)',
            color: isDark ? '#a6abb4' : '#686b73',
            pointerEvents: 'none',
          }}
        />
      </div>
      {isOpen &&
        menuPosition &&
        createPortal(
          <div
            id={`${id}-options`}
            ref={menuRef}
            role="listbox"
            aria-labelledby={`${id}-label`}
            style={{
              position: 'fixed',
              left: menuPosition.left,
              top: menuPosition.top,
              width: menuPosition.width,
              maxHeight: menuPosition.maxHeight,
              overflowY: 'auto',
              padding: 5,
              boxSizing: 'border-box',
              zIndex: 1200,
              border: `1px solid ${isDark ? 'rgba(255,255,255,.12)' : '#e8e9ec'}`,
              borderRadius: 14,
              backgroundColor: isDark ? '#202630' : '#ffffff',
              boxShadow: '0 12px 30px rgba(0,0,0,.2)',
            }}
          >
            {options.map((option) => (
              <button
                aria-selected={value === option}
                className="event-type-option"
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    moveFocus(event, 1);
                  } else if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    moveFocus(event, -1);
                  } else if (event.key === 'Escape') {
                    event.preventDefault();
                    event.stopPropagation();
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }
                }}
                role="option"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '9px 11px',
                  border: 0,
                  borderRadius: 9,
                  background: value === option ? 'rgba(255,127,192,.16)' : 'transparent',
                  color: isDark ? '#ffffff' : '#262626',
                  fontSize: 12,
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}

function WheelColumn({ label, values, value, onChange, isDark }) {
  const rowHeight = 40;
  const selectedIndex = values.indexOf(value);
  const columnRef = useRef(null);

  useEffect(() => {
    if (!columnRef.current || selectedIndex < 0) return;
    columnRef.current.scrollTop = selectedIndex * rowHeight;
  }, [selectedIndex]);

  return (
    <div style={{ minWidth: 0, flex: 1, textAlign: 'center' }}>
      <span
        style={{
          display: 'block',
          marginBottom: 8,
          color: isDark ? '#a6abb4' : '#858991',
          fontSize: 11,
        }}
      >
        {label}
      </span>
      <div
        aria-label={label}
        role="group"
        onScroll={(event) => {
          const index = Math.max(
            0,
            Math.min(values.length - 1, Math.round(event.currentTarget.scrollTop / rowHeight)),
          );
          if (values[index] !== value) onChange(values[index]);
        }}
        ref={columnRef}
        style={{
          height: rowHeight * 3,
          overflowY: 'auto',
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
          padding: `${rowHeight}px 0`,
          boxSizing: 'border-box',
          position: 'relative',
          touchAction: 'pan-y',
        }}
      >
        {values.map((item, index) => (
          <button
            aria-pressed={item === value}
            key={item}
            onClick={() => {
              onChange(item);
              if (columnRef.current) columnRef.current.scrollTop = index * rowHeight;
            }}
            style={{
              display: 'block',
              boxSizing: 'border-box',
              width: '100%',
              height: rowHeight,
              border: 0,
              padding: 0,
              background: 'transparent',
              color: item === value ? '#ff65ac' : isDark ? 'rgba(255,255,255,.52)' : '#9a9da3',
              fontSize: item === value ? 24 : 18,
              fontWeight: item === value ? 600 : 400,
              scrollSnapAlign: 'center',
              cursor: 'pointer',
            }}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function PickerField({
  id,
  label,
  value,
  placeholder,
  onClick,
  icon: Icon,
  isDark,
  required = false,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(2px, .22vw, 4px)' }}>
      <label
        className={LABEL_CLASS}
        htmlFor={id}
        style={{
          margin: 0,
          color: isDark ? '#a6abb4' : '#686b73',
          fontSize: 'clamp(10px, .58vw, 11px)',
          lineHeight: 1.35,
        }}
      >
        {label}
      </label>
      <button
        aria-haspopup="dialog"
        aria-required={required}
        className={INPUT_CLASS}
        id={id}
        onClick={onClick}
        style={{
          appearance: 'none',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: 'clamp(36px, 2.12vw, 40px)',
          padding: '0 clamp(12px, .85vw, 16px)',
          border: `1px solid ${isDark ? '#ffffff12' : '#e8e9ec'}`,
          borderRadius: 999,
          backgroundColor: isDark ? '#202630' : '#f1f3f5',
          color: value ? (isDark ? '#ffffff' : '#262626') : (isDark ? 'rgba(255,255,255,.4)' : '#858991'),
          fontSize: 'clamp(11px, .64vw, 12px)',
          textAlign: 'left',
          cursor: 'pointer',
        }}
        type="button"
      >
        <span>{value || placeholder}</span>
        <Icon size={15} style={{ flex: 'none', opacity: 0.65 }} />
      </button>
    </div>
  );
}

export default function CreateEventModal({
  isOpen,
  onClose,
  onCreatedEvent,
  initialCoords,
  onPickLocation,
  pickedLocation,
  pickedLocationAddress,
  isResolvingLocationAddress,
  locationAddressLookupFailed,
  onOpenMyEvents,
}) {
  const [step, setStep] = useState(1);
  const [locationMode, setLocationMode] = useState('choose');
  const [formData, setFormData] = useState(() => ({ ...EMPTY_EVENT_FORM }));
  const [photoName, setPhotoName] = useState('');
  const [createdEvent, setCreatedEvent] = useState(null);
  const [picker, setPicker] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [draftDate, setDraftDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });
  const [draftHour, setDraftHour] = useState('10');
  const [draftMinute, setDraftMinute] = useState('00');
  const [draftPeriod, setDraftPeriod] = useState('AM');
  const [focusedField, setFocusedField] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleClose = useCallback(() => {
    setStep(1);
    setLocationMode('choose');
    setFormData({ ...EMPTY_EVENT_FORM });
    setPhotoName('');
    setCreatedEvent(null);
    setPicker(null);
    setFocusedField('');
    setValidationError('');
    setDraftHour('10');
    setDraftMinute('00');
    setDraftPeriod('AM');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (picker) setPicker(null);
        else handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, isOpen, picker]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    setValidationError('');
  };

  const openDatePicker = () => {
    const today = getTodayDate();
    const savedDate = parseEventDate(formData.date);
    const selectedDate = savedDate && savedDate >= today ? savedDate : today;
    setDraftDate(selectedDate);
    setCalendarMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    setPicker('date');
  };

  const openTimePicker = () => {
    const match = formData.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      setDraftHour(String(Number(match[1])));
      setDraftMinute(match[2]);
      setDraftPeriod(match[3].toUpperCase());
    }
    setPicker('time');
  };

  const validateStep = () => {
    if (step === 1 && !formData.title.trim()) return 'Enter an event name to continue.';
    const eventDate = parseEventDate(formData.date);
    if (step === 2 && (!eventDate || !formData.time)) {
      return 'Select both a date and time to continue.';
    }
    if (step === 2 && eventDate < getTodayDate()) {
      return 'Choose today or a future date.';
    }
    if (step === 3) {
      if (locationMode === 'manual' && (!formData.city.trim() || !formData.address.trim())) {
        return 'Enter both a city and address, or pick a location on the map.';
      }
      if (
        locationMode === 'choose' &&
        (!pickedLocation ||
          !initialCoords ||
          !initialCoords.every((coordinate) => Number.isFinite(coordinate)))
      ) {
        return 'Pick a location on the map, or enter a city and address manually.';
      }
    }
    if (step === 4) {
      const participantLimit = Number(formData.people);
      if (!Number.isInteger(participantLimit) || participantLimit < 1) {
        return 'Enter a whole number of at least 1 for the participant limit.';
      }
      if (!formData.type) return 'Choose an event type to continue.';
    }
    return '';
  };

  const handleNext = async () => {
    const error = validateStep();
    if (error) {
      setValidationError(error);
      return;
    }

    if (step < STEPS.length) {
      setValidationError('');
      setStep((currentStep) => currentStep + 1);
      return;
    }

    if (isCreating) return;
    setIsCreating(true);

    try {
      let coordinates = initialCoords;
      if (locationMode === 'manual') {
        const params = new URLSearchParams({
          q: `${formData.address}, ${formData.city}`,
          limit: '1',
          lang: 'en',
        });
        const response = await fetch(`https://photon.komoot.io/api/?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`Manual location lookup failed with status ${response.status}`);
        }
        const result = await response.json();
        const [longitude, latitude] = result.features?.[0]?.geometry?.coordinates || [];
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          setValidationError('Could not find that address. Check it or pick a location on the map.');
          return;
        }
        coordinates = [latitude, longitude];
      }

      const image = formData.photo
        ? await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === 'string') resolve(reader.result);
              else reject(new Error('The selected event photo could not be read.'));
            };
            reader.onerror = () => reject(new Error('The selected event photo could not be read.'));
            reader.readAsDataURL(formData.photo);
          })
        : '';
      const newEvent = {
        id: Date.now(),
        ...formData,
        title: formData.title.trim(),
        city: locationMode === 'manual' ? formData.city.trim() : '',
        address:
          locationMode === 'choose'
            ? pickedLocationAddress || `Selected location (${coordinates[0].toFixed(5)}, ${coordinates[1].toFixed(5)})`
            : formData.address.trim(),
        category: formData.type,
        maxParticipants: Number(formData.people),
        people: `${formData.people} persons`,
        image,
        photo: null,
        lat: coordinates[0],
        lng: coordinates[1],
      };

      onCreatedEvent(newEvent);
      setCreatedEvent(newEvent);
      setValidationError('');
      setStep('success');
    } catch (error) {
      console.error('Unable to create event:', error);
      setValidationError('The event could not be created. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const cardClass =
    'relative my-auto w-full max-w-[520px] rounded-2xl border border-[#e8e6ea] bg-white p-5 font-rubik text-[#262626] shadow-2xl dark:border-white/10 dark:bg-[#151a22] dark:text-white sm:p-6';
  const isDark = document.documentElement.classList.contains('dark');
  const cardStyle = {
    boxSizing: 'border-box',
    position: 'relative',
    width: 'min(520px, calc(100vw - 32px))',
    maxWidth: 520,
    maxHeight: 'calc(100dvh - 32px)',
    overflowY: 'auto',
    margin: 'auto',
    padding: 'clamp(16px, 1.27vw, 24px)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,.1)' : '#e8e6ea'}`,
    borderRadius: 16,
    backgroundColor: isDark ? '#151a22' : '#ffffff',
    color: isDark ? '#ffffff' : '#262626',
    boxShadow: '0 24px 70px rgba(0,0,0,.24)',
    fontFamily: 'Rubik, system-ui, sans-serif',
  };
  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'auto',
    boxSizing: 'border-box',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,.55)',
    backdropFilter: 'blur(3px)',
  };
  const dateParts = getLocalDateParts(draftDate);
  const today = getTodayDate();
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
  const pickerCardStyle = {
    boxSizing: 'border-box',
    width: 'min(366px, calc(100vw - 40px))',
    padding: '24px clamp(18px, 2vw, 32px)',
    borderRadius: 22,
    backgroundColor: isDark ? '#151a22' : '#ffffff',
    color: isDark ? '#ffffff' : '#262626',
    boxShadow: '0 24px 70px rgba(0,0,0,.3)',
    fontFamily: 'Rubik, system-ui, sans-serif',
  };
  const pickerOverlayStyle = {
    ...overlayStyle,
    zIndex: 1100,
    backgroundColor: 'rgba(0,0,0,.7)',
    backdropFilter: 'blur(2px)',
  };
  const monthName = new Intl.DateTimeFormat('en', { month: 'long' }).format(calendarMonth);
  const timeHours = Array.from({ length: 12 }, (_, index) => String(index + 1));
  const timeMinutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'));

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-black/55 p-4 backdrop-blur-[3px]" style={overlayStyle}>
      {step === 'success' ? (
        <section
          aria-labelledby="create-event-success-title"
          aria-modal="true"
          className={cardClass}
          role="dialog"
          style={cardStyle}
        >
          <button
            aria-label="Close"
            className="absolute right-5 top-5 rounded-full p-1 text-[#858991] transition hover:bg-black/5 hover:text-[#262626] dark:hover:bg-white/10 dark:hover:text-white"
            onClick={handleClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
          <h2 className="pr-8 text-base font-bold" id="create-event-success-title">
            Event successfully created
          </h2>
          <p className="mt-1 text-xs text-[#777] dark:text-white/60">
            Your plan is on the map. Let&apos;s make it a good one.
          </p>
          <div className="my-5 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#ff7fc0] text-[#ff7fc0]">
            <Check className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div className="space-y-1 rounded-xl bg-[#f5f6f7] p-4 dark:bg-[#202630]">
            <h3 className="text-sm font-bold">{createdEvent?.title}</h3>
            <p className="pt-1 text-xs text-[#777] dark:text-white/60">
              {createdEvent?.date} · {createdEvent?.time}
            </p>
            <p className="text-xs text-[#777] dark:text-white/60">
              {createdEvent?.address || createdEvent?.city}
            </p>
            <p className="pt-1 text-[11px] text-[#858991] dark:text-white/45">
              {createdEvent?.people} · {createdEvent?.womenOnly ? 'Women only' : 'Open to everyone'}
            </p>
          </div>
          <div className="mt-5">
            <h3 className="text-xs font-semibold">Check more on My Events</h3>
            <p className="mt-1 text-xs leading-relaxed text-[#777] dark:text-white/55">
              You can edit details, invite friends and open your event&apos;s group chat from Created.
            </p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button
              className="h-9 rounded-full border border-[#e5e5e5] text-xs font-medium transition hover:bg-[#f5f5f5] dark:border-white/20 dark:hover:bg-white/10"
              onClick={handleClose}
              type="button"
            >
              Back to map
            </button>
            <button
              className="h-9 rounded-full bg-gradient-to-r from-[#ff7fc0] to-[#ff813e] text-xs font-semibold text-[#171717] transition hover:brightness-105"
              onClick={() => {
                handleClose();
                onOpenMyEvents?.();
              }}
              type="button"
            >
              My Events
            </button>
          </div>
        </section>
      ) : (
        <section
          aria-labelledby="create-event-title"
          aria-modal="true"
          className={cardClass}
          role="dialog"
          style={cardStyle}
        >
          <button
            aria-label="Close"
            className="absolute right-5 top-5 rounded-full p-1 text-[#858991] transition hover:bg-black/5 hover:text-[#262626] dark:hover:bg-white/10 dark:hover:text-white"
            onClick={handleClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>

          <h2
            className="pr-8 text-sm font-bold leading-5 tracking-tight"
            id="create-event-title"
            style={{
              margin: 0,
              paddingRight: 32,
              fontSize: 'clamp(12px, .74vw, 14px)',
              fontWeight: 700,
              lineHeight: 1.4,
            }}
          >
            Create an event <span className="font-semibold">{step} / 5</span>
          </h2>
          <p
            className="mt-0.5 text-[10px] leading-4 text-[#777] dark:text-white/60"
            style={{
              margin: '3px 0 0',
              color: isDark ? 'rgba(255,255,255,.6)' : '#777',
              fontSize: 'clamp(9px, .53vw, 10px)',
              lineHeight: 1.4,
            }}
          >
            A small plan can become a great story.
          </p>

          <div
            aria-label={`Step ${step} of 5`}
            className="mb-5 mt-4 grid grid-cols-5 gap-2"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
              gap: 'clamp(4px, .42vw, 8px)',
              margin: 'clamp(8px, .85vw, 16px) 0 clamp(10px, 1.05vw, 20px)',
            }}
          >
            {STEPS.map((stepName, index) => {
              const currentStep = index + 1;
              const isActive = currentStep === step;
              const isComplete = currentStep < step;

              return (
                <div className="min-w-0" key={stepName} style={{ minWidth: 0 }}>
                  <div
                    className={`h-0.5 rounded-full transition-colors ${
                      isActive || isComplete ? 'bg-[#ff65ac]' : 'bg-[#dfe2e7] dark:bg-white/15'
                    }`}
                    style={{
                      height: 2,
                      borderRadius: 999,
                      backgroundColor: isActive || isComplete ? '#ff65ac' : isDark ? 'rgba(255,255,255,.15)' : '#dfe2e7',
                    }}
                  />
                  <span
                    className={`mt-1 block truncate text-[11px] leading-4 ${
                      isActive
                        ? 'font-medium text-[#d94c91] dark:text-[#ff7fc0]'
                        : 'text-[#777] dark:text-white/50'
                    }`}
                    style={{
                      display: 'block',
                      overflow: 'hidden',
                      marginTop: 4,
                      color: isActive ? (isDark ? '#ff7fc0' : '#d94c91') : isDark ? 'rgba(255,255,255,.5)' : '#777',
                      fontSize: 'clamp(9px, .58vw, 11px)',
                      lineHeight: 1.35,
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {stepName}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, .53vw, 10px)' }}>
            {step === 1 && (
              <>
                <Field
                  id="event-title"
                  label="Event Name · Required"
                  isDark={isDark}
                  onChange={(value) => handleChange('title', value)}
                  placeholder="Coffee & conversations"
                  required
                  value={formData.title}
                />
                <div>
                  <label
                    className={LABEL_CLASS}
                    htmlFor="event-description"
                    style={{ display: 'block', margin: '0 0 3px', color: isDark ? '#a6abb4' : '#686b73', fontSize: 'clamp(10px, .58vw, 11px)', lineHeight: 1.35 }}
                  >
                    Description · Optional
                  </label>
                  <textarea
                    className="min-h-20 w-full resize-y rounded-xl border border-transparent bg-[#f1f3f5] px-4 py-2.5 text-xs text-[#262626] outline-none transition placeholder:text-[#858991] focus:border-[#ff7fc0] focus:ring-2 focus:ring-[#ff7fc0]/20 dark:bg-[#202630] dark:text-white dark:placeholder:text-white/45"
                    id="event-description"
                    onChange={(event) => handleChange('description', event.target.value)}
                    onFocus={() => setFocusedField('description')}
                    onBlur={() => setFocusedField('')}
                    placeholder={focusedField === 'description' ? '' : 'Describe your event...'}
                    style={{
                      boxSizing: 'border-box',
                      display: 'block',
                      width: '100%',
                      minHeight: 'clamp(64px, 4.24vw, 80px)',
                      padding: 'clamp(8px, .53vw, 10px) clamp(12px, .85vw, 16px)',
                      border: `1px solid ${isDark ? '#ffffff12' : '#e8e9ec'}`,
                      borderRadius: 12,
                      backgroundColor: isDark ? '#202630' : '#f1f3f5',
                      color: isDark ? '#ffffff' : '#262626',
                      fontSize: 'clamp(11px, .64vw, 12px)',
                      lineHeight: 1.45,
                      resize: 'vertical',
                    }}
                    value={formData.description}
                  />
                </div>
                <div>
                  <label
                    className={LABEL_CLASS}
                    htmlFor="event-photo"
                    style={{ display: 'block', margin: '0 0 3px', color: isDark ? '#a6abb4' : '#686b73', fontSize: 'clamp(10px, .58vw, 11px)', lineHeight: 1.35 }}
                  >
                    Photo · Optional
                  </label>
                  <label
                    className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-dashed border-[#d6d8dd] bg-[#f7f8f9] text-xs text-[#777] transition hover:border-[#ff7fc0] dark:border-white/20 dark:bg-[#202630] dark:text-white/55"
                    style={{
                      boxSizing: 'border-box',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      width: '100%',
                      height: 'clamp(36px, 2.12vw, 40px)',
                      overflow: 'hidden',
                      border: `1px dashed ${isDark ? 'rgba(255,255,255,.2)' : '#d6d8dd'}`,
                      borderRadius: 999,
                      backgroundColor: isDark ? '#202630' : '#f7f8f9',
                      color: isDark ? 'rgba(255,255,255,.55)' : '#777',
                      fontSize: 'clamp(11px, .64vw, 12px)',
                      cursor: 'pointer',
                    }}
                  >
                    <ImagePlus className="h-4 w-4" size={16} style={{ width: 'clamp(12px, .85vw, 16px)', height: 'clamp(12px, .85vw, 16px)' }} />
                    <span>{photoName || 'Add an event photo'}</span>
                    <input
                      accept="image/*"
                      className="sr-only"
                      id="event-photo"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        setPhotoName(file.name);
                        handleChange('photo', file);
                      }}
                      style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap', border: 0 }}
                      type="file"
                    />
                  </label>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <PickerField
                  id="event-date"
                  label="Date · Required"
                  icon={CalendarDays}
                  isDark={isDark}
                  onClick={openDatePicker}
                  placeholder="Select date"
                  required
                  value={formData.date}
                />
                <PickerField
                  id="event-time"
                  label="Time · Required"
                  icon={Clock3}
                  isDark={isDark}
                  onClick={openTimePicker}
                  placeholder="Select time"
                  required
                  value={formData.time}
                />
              </>
            )}

            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: 10,
                  }}
                >
                  <button
                    className="transition hover:border-[#ff7fc0]"
                    onClick={() => {
                      setLocationMode('choose');
                      onPickLocation();
                    }}
                    style={{
                      boxSizing: 'border-box',
                      display: 'flex',
                      minHeight: 44,
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 7,
                      border: `1px solid ${locationMode === 'choose' ? '#ff7fc0' : isDark ? 'rgba(255,255,255,.15)' : '#e5e5e5'}`,
                      borderRadius: 999,
                      background: locationMode === 'choose' ? 'rgba(255,127,192,.1)' : 'transparent',
                      color: isDark ? '#fff' : '#262626',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                    type="button"
                  >
                    <MapPin size={15} style={{ color: '#ff70b6' }} />
                    Pick on map
                  </button>
                  <button
                    className="transition hover:border-[#ff7fc0]"
                    onClick={() => setLocationMode('manual')}
                    style={{
                      boxSizing: 'border-box',
                      display: 'flex',
                      minHeight: 44,
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 7,
                      border: `1px solid ${locationMode === 'manual' ? '#ff7fc0' : isDark ? 'rgba(255,255,255,.15)' : '#e5e5e5'}`,
                      borderRadius: 999,
                      background: locationMode === 'manual' ? 'rgba(255,127,192,.1)' : 'transparent',
                      color: isDark ? '#fff' : '#262626',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                    type="button"
                  >
                    Enter manually
                  </button>
                </div>

                {locationMode === 'manual' ? (
                  <>
                    <Field
                      id="event-city"
                      label="City · Required"
                      isDark={isDark}
                      onChange={(value) => handleChange('city', value)}
                      placeholder="Poznan, Poland"
                      required
                      value={formData.city}
                    />
                    <Field
                      id="event-address"
                      label="Address · Required"
                      isDark={isDark}
                      onChange={(value) => handleChange('address', value)}
                      placeholder="Avenida, Poznan Glowny"
                      required
                      value={formData.address}
                    />
                  </>
                ) : (
                  <div
                    style={{
                      minHeight: 58,
                      padding: '12px 14px',
                      borderRadius: 12,
                      background: isDark ? '#202630' : '#f1f3f5',
                      color: isDark ? 'rgba(255,255,255,.62)' : '#777',
                      fontSize: 11,
                      lineHeight: 1.5,
                    }}
                  >
                    {pickedLocation && initialCoords ? (
                      <>
                        <span style={{ display: 'block', marginBottom: 3, color: '#e65b9f', fontWeight: 600 }}>
                          Location selected on map
                        </span>
                        {isResolvingLocationAddress
                          ? 'Finding street address…'
                          : pickedLocationAddress || (locationAddressLookupFailed
                            ? 'Could not find a street address. Try another point or enter it manually.'
                            : 'Select a point on the map or enter the address manually.')}
                      </>
                    ) : (
                      'Choose “Pick on map” and click a point on the map, or enter the city and address manually.'
                    )}
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <>
                <Field
                  id="event-people"
                  label="Up To · Required"
                  isDark={isDark}
                  onChange={(value) => handleChange('people', value.replace(/\D/g, ''))}
                  placeholder="6 persons"
                  inputMode="numeric"
                  required
                  value={formData.people}
                />
                <SelectField
                  id="event-type"
                  label="Type of Event · Required"
                  isDark={isDark}
                  onChange={(value) => handleChange('type', value)}
                  options={EVENT_TYPES}
                  required
                  value={formData.type}
                />
                <button
                  aria-checked={formData.womenOnly}
                  aria-label="Women only"
                  className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                    formData.womenOnly
                      ? 'border-[#e65a9c] bg-[#fce8f2] dark:border-[#ff7fc0] dark:bg-[#382a35]'
                      : 'border-[#e8e9ec] bg-[#f7f8f9] hover:border-[#ff7fc0] dark:border-white/15 dark:bg-[#202630]'
                  }`}
                  onClick={() => handleChange('womenOnly', !formData.womenOnly)}
                  role="switch"
                  type="button"
                >
                  <span className="min-w-0">
                    <span className="block text-xs font-medium text-[#262626] dark:text-white">
                      Women only
                    </span>
                    <span className="mt-0.5 block text-[10px] text-[#777] dark:text-white/55">
                      {formData.womenOnly ? 'Visible only to women' : 'Optional audience setting'}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                      formData.womenOnly ? 'bg-[#e65a9c]' : 'bg-[#b8bbc2] dark:bg-[#4a515b]'
                    }`}
                  >
                    <span
                      className={`size-5 rounded-full bg-white shadow transition-transform ${
                        formData.womenOnly ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </span>
                </button>
              </>
            )}

            {step === 5 && (
              <div>
                <label
                  className={LABEL_CLASS}
                  htmlFor="event-comments"
                  style={{ display: 'block', margin: '0 0 3px', color: isDark ? '#a6abb4' : '#686b73', fontSize: 'clamp(10px, .58vw, 11px)', lineHeight: 1.35 }}
                >
                  Any Comments · Optional
                </label>
                <textarea
                  className="min-h-24 w-full resize-y rounded-xl border border-transparent bg-[#f1f3f5] px-4 py-3 text-xs leading-5 text-[#262626] outline-none transition placeholder:text-[#858991] focus:border-[#ff7fc0] focus:ring-2 focus:ring-[#ff7fc0]/20 dark:bg-[#202630] dark:text-white dark:placeholder:text-white/45"
                  id="event-comments"
                  onChange={(event) => handleChange('comments', event.target.value)}
                  onFocus={() => setFocusedField('comments')}
                  onBlur={() => setFocusedField('')}
                  placeholder={focusedField === 'comments' ? '' : 'Add optional notes...'}
                  style={{
                    boxSizing: 'border-box',
                    display: 'block',
                    width: '100%',
                    minHeight: 'clamp(64px, 5.1vw, 96px)',
                    padding: 'clamp(8px, .64vw, 12px) clamp(12px, .85vw, 16px)',
                    border: `1px solid ${isDark ? '#ffffff12' : '#e8e9ec'}`,
                    borderRadius: 12,
                    backgroundColor: isDark ? '#202630' : '#f1f3f5',
                    color: isDark ? '#ffffff' : '#262626',
                    fontSize: 'clamp(11px, .64vw, 12px)',
                    lineHeight: 1.6,
                    resize: 'vertical',
                  }}
                  value={formData.comments}
                />
              </div>
            )}
          </div>

          {validationError && (
            <p aria-live="polite" className="mt-3 text-xs text-red-600 dark:text-red-300">
              {validationError}
            </p>
          )}
          <div
            className="mt-4 flex items-center justify-between gap-3"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              marginTop: 'clamp(10px, .85vw, 16px)',
            }}
          >
            <button
              className="h-9 min-w-[78px] rounded-full border border-[#e5e5e5] px-4 text-[11px] font-medium text-[#333] transition hover:bg-[#f5f5f5] dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              onClick={() => {
                setValidationError('');
                if (step === 1) handleClose();
                else setStep((currentStep) => currentStep - 1);
              }}
              style={{
                boxSizing: 'border-box',
                minWidth: 'clamp(72px, 4.14vw, 78px)',
                height: 'clamp(36px, 1.9vw, 36px)',
                padding: '0 clamp(10px, .85vw, 16px)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,.2)' : '#e5e5e5'}`,
                borderRadius: 999,
                background: 'transparent',
                color: isDark ? '#ffffff' : '#333333',
                fontSize: 'clamp(10px, .58vw, 11px)',
                fontWeight: 500,
                cursor: 'pointer',
              }}
              type="button"
            >
              Back
            </button>
            <button
              className="h-9 min-w-[112px] rounded-full bg-gradient-to-r from-[#ff7fc0] to-[#ff813e] px-5 text-[11px] font-semibold text-[#171717] shadow-sm transition hover:brightness-105 active:scale-[0.98]"
              disabled={isCreating}
              onClick={handleNext}
              style={{
                boxSizing: 'border-box',
                minWidth: 'clamp(104px, 5.93vw, 112px)',
                height: 'clamp(36px, 1.9vw, 36px)',
                padding: '0 clamp(12px, 1.06vw, 20px)',
                border: 0,
                borderRadius: 999,
                background: 'linear-gradient(90deg, #ff7fc0 0%, #ff813e 100%)',
                color: '#171717',
                fontSize: 'clamp(10px, .58vw, 11px)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              type="button"
            >
              {isCreating ? 'Creating…' : step === STEPS.length ? 'Create event' : 'Continue'}
            </button>
          </div>
        </section>
      )}
      {picker && (
        <div
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPicker(null);
          }}
          style={pickerOverlayStyle}
        >
          {picker === 'date' ? (
            <section
              aria-labelledby="event-date-picker-title"
              aria-modal="true"
              onMouseDown={(event) => event.stopPropagation()}
              role="dialog"
              style={{ ...pickerCardStyle, width: 'min(366px, calc(100vw - 40px))' }}
            >
              <h3
                id="event-date-picker-title"
                style={{ margin: '0 0 8px', textAlign: 'center', fontSize: 14, fontWeight: 500 }}
              >
                Date
              </h3>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: 62,
                }}
              >
                <button
                  aria-label="Previous month"
                  onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                  style={{ border: 0, background: 'transparent', color: isDark ? '#fff' : '#171717', cursor: 'pointer', padding: 8 }}
                  type="button"
                >
                  <ChevronLeft size={20} />
                </button>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#ff70b6', fontSize: 30, lineHeight: 1.05, fontWeight: 500 }}>
                    {calendarMonth.getFullYear()}
                  </div>
                  <div style={{ color: '#ff70b6', fontSize: 13, lineHeight: 1.4 }}>
                    {monthName}
                  </div>
                </div>
                <button
                  aria-label="Next month"
                  onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                  style={{ border: 0, background: 'transparent', color: isDark ? '#fff' : '#171717', cursor: 'pointer', padding: 8 }}
                  type="button"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div
                aria-label={`${monthName} ${calendarMonth.getFullYear()}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                  justifyItems: 'center',
                  rowGap: 2,
                  marginTop: 12,
                }}
              >
                {calendarDays.map((day, index) => {
                  if (day === null) return <span aria-hidden="true" key={`empty-${index}`} />;
                  const isSelected =
                    day === dateParts.day &&
                    calendarMonth.getMonth() === dateParts.month &&
                    calendarMonth.getFullYear() === dateParts.year;
                  const dayDate = new Date(
                    calendarMonth.getFullYear(),
                    calendarMonth.getMonth(),
                    day,
                  );
                  const isPastDate = dayDate < today;

                  return (
                    <button
                      disabled={isPastDate}
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
                      aria-pressed={isSelected}
                      key={day}
                      onClick={() => {
                        if (!isPastDate) setDraftDate(dayDate);
                      }}
                      style={{
                        width: 34,
                        height: 34,
                        padding: 0,
                        border: 0,
                        borderRadius: '50%',
                        background: isSelected ? 'linear-gradient(135deg, #ff7fc0, #ff69b4)' : 'transparent',
                        color: isPastDate
                          ? isDark ? 'rgba(255,255,255,.25)' : '#b9bbc0'
                          : isSelected ? '#ffffff' : isDark ? '#ffffff' : '#171717',
                        fontSize: 12,
                        fontWeight: isSelected ? 600 : 400,
                        cursor: isPastDate ? 'not-allowed' : 'pointer',
                        opacity: isPastDate ? 0.55 : 1,
                      }}
                      type="button"
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  handleChange('date', formatEventDate(draftDate));
                  setPicker(null);
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  height: 48,
                  marginTop: 24,
                  border: 0,
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, #ff7fc0 0%, #ff813e 100%)',
                  color: '#ffffff',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
                type="button"
              >
                Save
              </button>
            </section>
          ) : (
            <section
              aria-labelledby="event-time-picker-title"
              aria-modal="true"
              onMouseDown={(event) => event.stopPropagation()}
              role="dialog"
              style={{ ...pickerCardStyle, width: 'min(350px, calc(100vw - 40px))' }}
            >
              <h3
                id="event-time-picker-title"
                style={{ margin: '0 0 6px', textAlign: 'center', fontSize: 16, fontWeight: 600 }}
              >
                Time
              </h3>
              <p style={{ margin: '0 0 20px', textAlign: 'center', color: isDark ? '#a6abb4' : '#858991', fontSize: 11 }}>
                Scroll to select a time
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    zIndex: 0,
                    top: 63,
                    left: 0,
                    right: 0,
                    height: 40,
                    borderTop: `1px solid ${isDark ? 'rgba(255,255,255,.12)' : '#e8e9ec'}`,
                    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,.12)' : '#e8e9ec'}`,
                    pointerEvents: 'none',
                  }}
                />
                <WheelColumn
                  isDark={isDark}
                  label="Hour"
                  onChange={setDraftHour}
                  value={draftHour}
                  values={timeHours}
                />
                <span aria-hidden="true" style={{ paddingTop: 24, color: '#ff70b6', fontSize: 24 }}>:</span>
                <WheelColumn
                  isDark={isDark}
                  label="Minute"
                  onChange={setDraftMinute}
                  value={draftMinute}
                  values={timeMinutes}
                />
                <WheelColumn
                  isDark={isDark}
                  label="AM/PM"
                  onChange={setDraftPeriod}
                  value={draftPeriod}
                  values={['AM', 'PM']}
                />
              </div>
              <button
                onClick={() => {
                  handleChange('time', `${Number(draftHour)}:${draftMinute} ${draftPeriod}`);
                  setPicker(null);
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  height: 48,
                  marginTop: 24,
                  border: 0,
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, #ff7fc0 0%, #ff813e 100%)',
                  color: '#ffffff',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
                type="button"
              >
                Save
              </button>
            </section>
          )}
        </div>
      )}
    </div>,
    document.body,
  );
}
