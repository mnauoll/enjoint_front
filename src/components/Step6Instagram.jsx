import React, { useState } from 'react';

const Step6Instagram = ({ onNext, initialData, username }) => {
  const [instaHandle, setInstaHandle] = useState(
    initialData?.instagramHandle || (username ? `@${username}` : '@alexmorgan')
  );
  const [isConnected, setIsConnected] = useState(
    initialData?.instagramConnected || false
  );
  const [isEditing, setIsEditing] = useState(false);

  // Открытие поля ввода при клике на Connect
  const handleStartConnect = () => {
    setIsEditing(true);
  };

  // Сохранение введённого ника
  const handleConfirmHandle = (e) => {
    e.preventDefault();
    let formatted = instaHandle.trim();

    if (formatted) {
      if (!formatted.startsWith('@')) {
        formatted = '@' + formatted;
      }
      setInstaHandle(formatted);
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
    setIsEditing(false);
  };

  const handleNext = (e) => {
    e?.preventDefault();
    onNext({
      instagramConnected: isConnected,
      instagramHandle: isConnected ? instaHandle : '',
    });
  };

  const handleSkip = () => {
    onNext({
      instagramConnected: false,
      instagramHandle: '',
    });
  };

  return (
    <>
      <div className="introduction">
        <h1 className="introduction-heading">Instagram</h1>
        <p className="introduction-description">
          Connect your Instagram account to share more of your world.
        </p>
      </div>

      <div className="instagram-container">
        
        {/* Иконка Instagram в розовом круге */}
        <div className="instagram-circle-logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="6" stroke="rgba(255, 127, 192, 1)" strokeWidth="1.8"/>
            <circle cx="12" cy="12" r="4.5" stroke="rgba(255, 127, 192, 1)" strokeWidth="1.8"/>
            <circle cx="17.5" cy="6.5" r="1" fill="rgba(255, 127, 192, 1)"/>
          </svg>
        </div>

        {/* Форма ввода ника или кнопка/плашка подключения */}
        {isEditing ? (
          <form onSubmit={handleConfirmHandle} className="instagram-input-form">
            <span className="instagram-btn-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="6" stroke="rgba(255, 127, 192, 1)" strokeWidth="2"/>
                <circle cx="12" cy="12" r="4.5" stroke="rgba(255, 127, 192, 1)" strokeWidth="2"/>
                <circle cx="17.5" cy="6.5" r="1.2" fill="rgba(255, 127, 192, 1)"/>
              </svg>
            </span>
            <input
              type="text"
              className="instagram-handle-input"
              placeholder="@username"
              value={instaHandle}
              onChange={(e) => setInstaHandle(e.target.value)}
              autoFocus
            />
            <button type="submit" className="instagram-save-btn">
              Connect
            </button>
          </form>
        ) : isConnected ? (
          <button
            type="button"
            className="instagram-connect-btn connected"
            onClick={handleStartConnect}
          >
            <span className="instagram-btn-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="6" stroke="rgba(255, 127, 192, 1)" strokeWidth="2"/>
                <circle cx="12" cy="12" r="4.5" stroke="rgba(255, 127, 192, 1)" strokeWidth="2"/>
                <circle cx="17.5" cy="6.5" r="1.2" fill="rgba(255, 127, 192, 1)"/>
              </svg>
            </span>
            <span className="instagram-btn-text">
              Instagram connected • {instaHandle}
            </span>
          </button>
        ) : (
          <button
            type="button"
            className="instagram-connect-btn"
            onClick={handleStartConnect}
          >
            <span className="instagram-btn-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="6" stroke="rgba(255, 127, 192, 1)" strokeWidth="2"/>
                <circle cx="12" cy="12" r="4.5" stroke="rgba(255, 127, 192, 1)" strokeWidth="2"/>
                <circle cx="17.5" cy="6.5" r="1.2" fill="rgba(255, 127, 192, 1)"/>
              </svg>
            </span>
            <span className="instagram-btn-text">Connect with Instagram</span>
          </button>
        )}

        {/* Единственное сообщение статуса под кнопкой */}
        <div className="instagram-status-block">
          {isConnected ? (
            <div className="instagram-status-row success">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="rgba(50, 129, 70, 1)" strokeWidth="1.5"/>
                <path d="M5 8L7 10L11 6" stroke="rgba(50, 129, 70, 1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Example account connected.</span>
            </div>
          ) : (
            <p className="instagram-status-subtext">
              No account connected. You can connect later.
            </p>
          )}
        </div>

        {/* Кнопка Next и ссылка Skip */}
        <div className="auth-actions">
          <button type="button" className="submit-btn" onClick={handleNext}>
            Next
          </button>
          
          <button type="button" className="skip-action-link" onClick={handleSkip}>
            Skip
          </button>
        </div>

      </div>
    </>
  );
};

export default Step6Instagram;