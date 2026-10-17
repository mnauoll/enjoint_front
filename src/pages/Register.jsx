import React, { useState } from 'react';
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
  const [slideDirection, setSlideDirection] = useState('next'); // 'next' или 'prev'
  const [registrationData, setRegistrationData] = useState(initialFormState);

  // Переход вперед
  const handleNextStep = (stepData) => {
    if (stepData) {
      setRegistrationData((prev) => ({ ...prev, ...stepData }));
    }
    setSlideDirection('next');
    setCurrentStep((prev) => prev + 1);
  };

  // Переход на 1 шаг назад
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setSlideDirection('prev');
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Сброс на Шаг 1 при клике на крестик
  const handleResetToStep1 = () => {
    setSlideDirection('prev'); // Анимация выезда слева направо
    setCurrentStep(1);
    setRegistrationData(initialFormState); // Сброс заполненных данных
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
    <div className="register-page">
      <header className="register-header">
        {/* Кнопка назад */}
        <button className="header-nav-btn" type="button" onClick={handlePrevStep}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="rgba(38, 38, 38, 1)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Прогресс-бар */}
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

        {/* Кнопка крестик (сброс на шаг 1) */}
        <button className="header-nav-btn" type="button" onClick={handleResetToStep1}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M13 1L1 13M1 1L13 13" stroke="rgba(38, 38, 38, 1)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>

      {/* Карточка регистрации */}
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
    </div>
  );
};

export default Register;