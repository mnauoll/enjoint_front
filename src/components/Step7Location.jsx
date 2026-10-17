import React, { useState, useEffect } from 'react';

const Step7Location = ({ onNext, initialData }) => {
  const [locationEnabled, setLocationEnabled] = useState(
    initialData?.locationEnabled !== undefined ? initialData.locationEnabled : true
  );
  const [isManual, setIsManual] = useState(
    initialData?.isManualLocation || false
  );
  const [city, setCity] = useState(initialData?.city || '');
  const [coords, setCoords] = useState(initialData?.coords || null);

  // Запрос геолокации браузера при включении переключателя
  useEffect(() => {
    if (locationEnabled && !isManual && !coords) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoords({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.log('Geolocation permission denied or error:', error);
          }
        );
      }
    }
  }, [locationEnabled, isManual, coords]);

  const handleToggle = () => {
    setLocationEnabled((prev) => !prev);
  };

  const handleNext = (e) => {
    e?.preventDefault();
    onNext({
      locationEnabled: isManual ? true : locationEnabled,
      isManualLocation: isManual,
      city: isManual ? city : '',
      coords: !isManual && locationEnabled ? coords : null,
    });
  };

  const handleSkip = () => {
    onNext({
      locationEnabled: false,
      isManualLocation: false,
      city: '',
      coords: null,
    });
  };

  return (
    <>
      <div className="introduction">
        <h1 className="introduction-heading">Your Location</h1>
        <p className="introduction-description">
          Enable your location to discover people nearby.
        </p>
      </div>

      <div className="location-container">
        
        {/* Иконка локации в круглом фоне */}
        <div className="location-circle-logo">
          <svg width="28" height="32" viewBox="0 0 20 24" fill="none">
            <path
              d="M10 1C5.02944 1 1 5.02944 1 10C1 16.5 10 23 10 23C10 23 19 16.5 19 10C19 5.02944 14.9706 1 10 1Z"
              stroke="rgba(255, 127, 192, 1)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="10" cy="10" r="3.5" stroke="rgba(255, 127, 192, 1)" strokeWidth="1.8"/>
          </svg>
        </div>

        {/* Переключение: Вариант A (Тумблер Доступа) или Вариант B (Ручной ввод города) */}
        {!isManual ? (
          <div className="location-access-block">
            
            {/* Карточка переключателя (Location Access) */}
            <div className="location-access-card">
              <span className="location-access-label">Location access</span>
              
              {/* Тумблер 44px x 26px по параметрам Figma */}
              <button
                type="button"
                className={`location-toggle-switch ${locationEnabled ? 'active' : ''}`}
                onClick={handleToggle}
              >
                <div className="toggle-thumb" />
              </button>
            </div>

            {/* Сообщение о статусе геолокации */}
            <div className="location-status-block">
              {locationEnabled ? (
                <>
                  <div className="location-status-row success">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="rgba(50, 129, 70, 1)" strokeWidth="1.5"/>
                      <path d="M5 8L7 10L11 6" stroke="rgba(50, 129, 70, 1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Location access allowed.</span>
                  </div>
                  <p className="location-status-subtext">
                    Your location helps you find people nearby.
                  </p>
                </>
              ) : (
                <>
                  <div className="location-status-row skipped">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="rgba(119, 119, 119, 1)" strokeWidth="1.5"/>
                      <path d="M5 8H11" stroke="rgba(119, 119, 119, 1)" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span>Skipped. Continue without location.</span>
                  </div>
                  <p className="location-status-subtext">
                    Location access is not enabled. You can add it later.
                  </p>
                </>
              )}
            </div>

          </div>
        ) : (
          /* Форма ручного ввода города "What is your city?" */
          <div className="location-manual-block">
            <label className="field-label manual-city-label">What is your city?</label>
            <div className="input-wrapper city-input-wrapper">
              <span className="input-icon">
                <svg width="16" height="18" viewBox="0 0 20 24" fill="none">
                  <path d="M10 1C5.02944 1 1 5.02944 1 10C1 16.5 10 23 10 23C10 23 19 16.5 19 10C19 5.02944 14.9706 1 10 1Z" stroke="rgba(119, 119, 119, 1)" strokeWidth="1.6"/>
                  <circle cx="10" cy="10" r="3" stroke="rgba(119, 119, 119, 1)" strokeWidth="1.6"/>
                </svg>
              </span>
              <input
                type="text"
                className="input-field"
                placeholder="Enter your city (e.g. Warsaw)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Нижний зафиксированный блок с кнопками */}
        <div className="auth-actions">
          <button type="button" className="submit-btn" onClick={handleNext}>
            Next
          </button>
          
          <div className="location-links-row">
            <button type="button" className="skip-action-link" onClick={handleSkip}>
              Skip
            </button>
            
            <button
              type="button"
              className="location-manual-toggle-btn"
              onClick={() => setIsManual((prev) => !prev)}
            >
              {isManual ? 'Use Auto Location' : 'Enter Location Manually'}
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default Step7Location;