import React, { useState } from 'react';

// Список 14 интересов с иконками
const INTERESTS_LIST = [
  {
    id: 'photography',
    label: 'Photography',
    icon: (
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
        <path d="M2 5C2 3.89543 2.89543 3 4 3H6.2L7.5 1H10.5L11.8 3H14C15.1046 3 16 3.89543 16 5V13C16 14.1046 15.1046 15 14 15H4C2.89543 15 2 14.1046 2 13V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    id: 'shopping',
    label: 'Shopping',
    icon: (
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
        <path d="M3 5H15L16 15H2L3 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 5V3C6 1.89543 6.89543 1 8 1H10C11.1046 1 12 1.89543 12 3V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'karaoke',
    label: 'Karaoke',
    icon: (
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
        <rect x="6.5" y="1" width="5" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3.5 7.5V8.5C3.5 11.5376 5.96243 14 9 14C12.0376 14 14.5 11.5376 14.5 8.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 14V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'cooking',
    label: 'Cooking',
    icon: (
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
        <path d="M2 7C2 10.866 5.13401 14 9 14C12.866 14 16 10.866 16 7H2Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 4V1M9 4V1M13 4V1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'yoga',
    label: 'Yoga',
    icon: (
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
        <circle cx="9" cy="3" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 14C4.5 11.5 6 10 9 10C12 10 13.5 11.5 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M5 8C7 6.5 11 6.5 13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'tennis',
    label: 'Tennis',
    icon: (
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
        <circle cx="9" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 4C6 6.5 6 9.5 4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M14 4C12 6.5 12 9.5 14 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'run',
    label: 'Run',
    icon: (
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
        <circle cx="12" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 14L8 10L10 11L13 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 9L6 8L9 9L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 'art',
    label: 'Art',
    icon: (
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
        <path d="M9 15C12.866 15 16 12.0899 16 8.5C16 4.91015 12.866 2 9 2C5.13401 2 2 4.91015 2 8.5C2 10.5 3.5 12 5.5 12H6.5C7.3 12 8 12.7 8 13.5V14C8 14.6 8.4 15 9 15Z" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="5.5" cy="5.5" r="1" fill="currentColor"/>
        <circle cx="9" cy="4.5" r="1" fill="currentColor"/>
        <circle cx="12.5" cy="5.5" r="1" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'drink',
    label: 'Drink',
    icon: (
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
        <path d="M4 2L9 8L14 2H4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 8V14M6 14H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'videogames',
    label: 'Video games',
    icon: (
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
        <rect x="1.5" y="3.5" width="15" height="9" rx="3.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4.5 8H7.5M6 6.5V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="7" r="0.8" fill="currentColor"/>
        <circle cx="14" cy="9" r="0.8" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'extreme',
    label: 'Extreme',
    icon: (
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
        <path d="M9 1L15 6L9 15L3 6L9 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 6H15" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    id: 'music',
    label: 'Music',
    icon: (
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
        <path d="M6 13C7.10457 13 8 12.1046 8 11V3L15 1.5V9.5C15 10.6046 14.1046 11.5 13 11.5C11.8954 11.5 11 10.6046 11 9.5C11 8.39543 11.8954 7.5 13 7.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="4" cy="11" r="2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    id: 'swimming',
    label: 'Swimming',
    icon: (
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
        <path d="M2 11C4 9.5 6 9.5 8 11C10 12.5 12 12.5 14 11C15 10.25 16 10.25 17 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M2 14C4 12.5 6 12.5 8 14C10 15.5 12 15.5 14 14C15 13.25 16 13.25 17 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    id: 'traveling',
    label: 'Traveling',
    icon: (
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
        <path d="M2 14L8 3L11 8L13 5L16 14H2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
];

const Step5Interests = ({ onNext, initialData }) => {
  const [selectedInterests, setSelectedInterests] = useState(
    initialData?.interests || []
  );
  const [showError, setShowError] = useState(false);

  // Выбор/отмена выбора интереса
  const toggleInterest = (id) => {
    setSelectedInterests((prev) => {
      const isAlreadySelected = prev.includes(id);
      const updated = isAlreadySelected
        ? prev.filter((item) => item !== id)
        : [...prev, id];

      if (updated.length >= 4) {
        setShowError(false);
      }
      return updated;
    });
  };

  const isValid = selectedInterests.length >= 4;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValid) {
      setShowError(true);
      return;
    }

    onNext({ interests: selectedInterests });
  };

  return (
    <>
      <div className="introduction">
        <h1 className="introduction-heading">Your Interests</h1>
        <p className="introduction-description">
          Select a few of your interests and let everyone know what you’re passionate about.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="interests-container" noValidate>
        
        {/* Сетка интересов 590px из Figma */}
        <div className="interests-grid">
          {INTERESTS_LIST.map((item) => {
            const isSelected = selectedInterests.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                className={`interest-card ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleInterest(item.id)}
              >
                <span className="interest-icon">{item.icon}</span>
                <span className="interest-label">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Счётчик и подпись с динамческой валидацией */}
        <div className="interests-validation-block">
          <span className="interests-count-text">
            {selectedInterests.length} options selected
          </span>

          <div className={`interests-status-msg ${showError && !isValid ? 'error' : 'valid'}`}>
            {showError && !isValid ? (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="rgba(214, 40, 40, 1)" strokeWidth="1.5"/>
                  <path d="M8 5V9M8 11V11.5" stroke="rgba(214, 40, 40, 1)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>Choose at least four options.</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke={isValid ? "rgba(50, 129, 70, 1)" : "rgba(180, 180, 180, 1)"} strokeWidth="1.5"/>
                  <path d="M5 8L7 10L11 6" stroke={isValid ? "rgba(50, 129, 70, 1)" : "rgba(180, 180, 180, 1)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ color: isValid ? 'rgba(50, 129, 70, 1)' : 'rgba(119, 119, 119, 1)' }}>
                  Choose at least four options.
                </span>
              </>
            )}
          </div>
        </div>

        {/* Зафиксированная кнопка Next */}
        <div className="auth-actions">
          <button type="submit" className="submit-btn">
            Next
          </button>
        </div>

      </form>
    </>
  );
};

export default Step5Interests;