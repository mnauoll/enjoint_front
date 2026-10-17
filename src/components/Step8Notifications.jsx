import React, { useState } from 'react';

const Step8Notifications = ({ onFinish, initialData }) => {
  const [pushEnabled, setPushEnabled] = useState(
    initialData?.pushEnabled !== undefined ? initialData.pushEnabled : true
  );

  const handleToggle = () => {
    setPushEnabled((prev) => !prev);
  };

  const handleFinish = (e) => {
    e?.preventDefault();
    onFinish({ pushEnabled });
  };

  const handleSkip = () => {
    onFinish({ pushEnabled: false });
  };

  return (
    <>
      <div className="introduction">
        <h1 className="introduction-heading">Notifications</h1>
        <p className="introduction-description">
          Get push notifications when you get a match or receive a message.
        </p>
      </div>

      <div className="notifications-container">
        
        {/* Векторный логотип колокольчика из Figma */}
        <div className="notifications-circle-logo">
          {pushEnabled ? (
            /* Включенный колокольчик: 42px x 46.67px, Border 2px */
            <svg width="42" height="47" viewBox="0 0 42 47" fill="none">
              {/* Купол и основание колокольчика */}
              <path
                d="M 6 32.5 C 6 18 11.5 6 21 6 C 30.5 6 36 18 36 32.5 C 38 32.5 39 33.5 39 34.5 C 39 35.5 38 36 36 36 H 6 C 4 36 3 35.5 3 34.5 C 3 33.5 4 32.5 6 32.5 Z"
                stroke="rgba(255, 127, 192, 1)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Ниже расположенный язычок (дуга) */}
              <path
                d="M 18.5 39.5 C 19.5 41.5 22.5 41.5 23.5 39.5"
                stroke="rgba(255, 127, 192, 1)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            /* Перечёркнутый колокольчик: 46.67px x 46.67px, Border 2px */
            <svg width="47" height="47" viewBox="0 0 47 47" fill="none">
              {/* Купол и основание колокольчика */}
              <path
                d="M 8.33 32.5 C 8.33 18 13.83 6 23.33 6 C 32.83 6 38.33 18 38.33 32.5 C 40.33 32.5 41.33 33.5 41.33 34.5 C 41.33 35.5 40.33 36 38.33 36 H 8.33 C 6.33 36 5.33 35.5 5.33 34.5 C 5.33 33.5 6.33 32.5 8.33 32.5 Z"
                stroke="rgba(255, 127, 192, 1)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Ниже расположенный язычок (дуга) */}
              <path
                d="M 20.83 39.5 C 21.83 41.5 24.83 41.5 25.83 39.5"
                stroke="rgba(255, 127, 192, 1)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Диагональная черта перечеркивания */}
              <path
                d="M 7 7 L 40 40"
                stroke="rgba(255, 127, 192, 1)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>

        {/* Плашка переключателя Push notifications */}
        <div className="notifications-access-card">
          <span className="notifications-access-label">Push notifications</span>
          
          <button
            type="button"
            className={`location-toggle-switch ${pushEnabled ? 'active' : ''}`}
            onClick={handleToggle}
          >
            <div className="toggle-thumb" />
          </button>
        </div>

        {/* Сообщение статуса под плашкой */}
        <div className="notifications-status-block">
          {pushEnabled ? (
            <>
              <div className="notifications-status-row success">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="rgba(50, 129, 70, 1)" strokeWidth="1.5"/>
                  <path d="M5 8L7 10L11 6" stroke="rgba(50, 129, 70, 1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Notifications enabled.</span>
              </div>
              <p className="notifications-status-subtext">
                You’re ready to stay in the loop.
              </p>
            </>
          ) : (
            <>
              <div className="notifications-status-row skipped">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="rgba(119, 119, 119, 1)" strokeWidth="1.5"/>
                  <path d="M5 8H11" stroke="rgba(119, 119, 119, 1)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>Skipped. Continue without notifications.</span>
              </div>
              <p className="notifications-status-subtext">
                Notifications are off. You can turn them on later.
              </p>
            </>
          )}
        </div>

        {/* Зафиксированные действия снизу */}
        <div className="auth-actions">
          <button type="button" className="submit-btn" onClick={handleFinish}>
            Finish
          </button>
          
        </div>

      </div>
    </>
  );
};

export default Step8Notifications;