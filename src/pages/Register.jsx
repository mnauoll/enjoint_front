import React, { useState, useEffect } from 'react';
import Step1Account from '../components/Step1Account';
import Step2Verification from '../components/Step2Verification';
import Step3Profile from '../components/Step3Profile';
import Step4PhotoBio from '../components/Step4PhotoBio';
import Step5Interests from '../components/Step5Interests';
import Step6Instagram from '../components/Step6Instagram';
import Step7Location from '../components/Step7Location';
import Step8Notifications from '../components/Step8Notifications';
import './Register.css';

const initialFormState = {
  email: '',
  password: '',
  confirmPassword: '',
  username: '',
  age: '',
  gender: '',
  photo: null,
  photoName: '',
  bio: '',
  interests: [],
  instagramConnected: false,
  instagramHandle: '',
  locationEnabled: true,
  isManualLocation: false,
  city: '',
  coords: null,
  pushEnabled: true,
};

const Register = () => {
  const totalSteps = 8;
  const [currentStep, setCurrentStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState('next');
  const [registrationData, setRegistrationData] = useState(initialFormState);

  // 1. Состояние темы (проверяем localStorage при загрузке)
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // 2. Сохраняем состояние темы в localStorage
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // 3. Функция переключения темы
  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleNextStep = (stepData) => {
    if (stepData) {
      setRegistrationData((prev) => ({ ...prev, ...stepData }));
    }
    setSlideDirection('next');
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setSlideDirection('prev');
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleResetToStep1 = () => {
    setSlideDirection('prev');
    setCurrentStep(1);
    setRegistrationData(initialFormState);
  };

  const handleStep1Complete = (data) => handleNextStep(data);
  const handleStep2Complete = () => handleNextStep();
  const handleStep3Complete = (data) => handleNextStep(data);
  const handleStep4Complete = (data) => handleNextStep(data);
  const handleStep5Complete = (data) => handleNextStep(data);
  const handleStep6Complete = (data) => handleNextStep(data);
  const handleStep7Complete = (data) => handleNextStep(data);

  const handleFinalSubmit = (notificationsData) => {
    const finalData = { ...registrationData, ...notificationsData };
    setRegistrationData(finalData);
    console.log('РЕГИСТРАЦИЯ УСПЕШНО ЗАВЕРШЕНА!', finalData);
    alert('Поздравляем! Регистрация прошла успешно.');
  };

  return (
    /* Навешиваем класс .dark на главный контейнер страницы */
    <div className={`register-page ${isDark ? 'dark' : ''}`}>
      
      {/* Шапка навигации */}
      <header className="register-header">
        <button className="header-nav-btn" type="button" onClick={handlePrevStep}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="progress-container">
          <span className="step-count-text">ENJOINT · {currentStep} / {totalSteps}</span>
          <div className="progress-bar">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className="progress-segment">
                <div
                  className="progress-segment-fill"
                  style={{ width: index < currentStep ? '100%' : '0%' }}
                />
              </div>
            ))}
          </div>
        </div>

        <button className="header-nav-btn" type="button" onClick={handleResetToStep1}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M13 1L1 13M1 1L13 13" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>

      {/* Белая/Тёмная карточка шага */}
      <div 
        key={currentStep} 
        className={`registration-card card-anim-${slideDirection}`}
      >
        {currentStep === 1 && (
          <Step1Account 
            onNext={handleStep1Complete} 
            initialData={registrationData} 
          />
        )}

        {currentStep === 2 && (
          <Step2Verification 
            email={registrationData.email} 
            onSuccess={handleStep2Complete} 
          />
        )}

        {currentStep === 3 && (
          <Step3Profile 
            onNext={handleStep3Complete} 
            initialData={registrationData} 
          />
        )}

        {currentStep === 4 && (
          <Step4PhotoBio 
            onNext={handleStep4Complete} 
            initialData={registrationData} 
          />
        )}

        {currentStep === 5 && (
          <Step5Interests 
            onNext={handleStep5Complete} 
            initialData={registrationData} 
          />
        )}

        {currentStep === 6 && (
          <Step6Instagram 
            onNext={handleStep6Complete} 
            initialData={registrationData}
            username={registrationData.username}
          />
        )}

        {currentStep === 7 && (
          <Step7Location 
            onNext={handleStep7Complete} 
            initialData={registrationData}
          />
        )}

        {currentStep === 8 && (
          <Step8Notifications 
            onFinish={handleFinalSubmit} 
            initialData={registrationData}
          />
        )}
      </div>

      {/* Глобальная кнопка переключения темы (фиксирована слева снизу на ВСЕХ шагах) */}
      <button 
        type="button" 
        className="dark-mode-btn"
        onClick={handleToggleTheme}
      >
        {isDark ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <span>Light mode</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <span>Dark mode</span>
          </>
        )}
      </button>
    </div>
  );
};

export default Register;