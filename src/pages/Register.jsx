import React, { useState, useEffect } from "react";
import Step1Account from "../components/Step1Account";
import Step2Verification from "../components/Step2Verification";
import Step3Profile from "../components/Step3Profile";
import Step4PhotoBio from "../components/Step4PhotoBio";
import Step5Interests from "../components/Step5Interests";
import Step6Instagram from "../components/Step6Instagram";
import Step7Location from "../components/Step7Location";
import Step8Notifications from "../components/Step8Notifications";

const initialFormState = {
  email: "",
  password: "",
  confirmPassword: "",
  username: "",
  age: "",
  gender: "",
  photo: null,
  photoName: "",
  bio: "",
  interests: [],
  instagramConnected: false,
  instagramHandle: "",
  locationEnabled: true,
  isManualLocation: false,
  city: "",
  coords: null,
  pushEnabled: true,
};

const Register = () => {
  const totalSteps = 8;
  const [currentStep, setCurrentStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState("next");
  const [registrationData, setRegistrationData] = useState(initialFormState);

  // 1. Состояние темы (проверяем localStorage при загрузке)
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // 2. Сохраняем состояние темы в localStorage
  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // 3. Функция переключения темы
  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleNextStep = (stepData) => {
    if (stepData) {
      setRegistrationData((prev) => ({ ...prev, ...stepData }));
    }
    setSlideDirection("next");
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setSlideDirection("prev");
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleResetToStep1 = () => {
    setSlideDirection("prev");
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
    console.log("РЕГИСТРАЦИЯ УСПЕШНО ЗАВЕРШЕНА!", finalData);
    alert("Поздравляем! Регистрация прошла успешно.");
  };

  return (
    /* Навешиваем класс .dark на главный контейнер страницы */
    <div
      className={`relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#fff] bg-[image:radial-gradient(circle_at_100%_0%,rgba(255,129,62,0.35)_0%,transparent_55%),radial-gradient(circle_at_0%_100%,rgba(255,127,192,0.4)_0%,transparent_55%)] font-rubik text-ink dark:bg-[#05070a] dark:bg-[image:linear-gradient(225deg,rgba(255,127,192,0.5)_0%,transparent_50%),linear-gradient(45deg,rgba(255,129,62,0.75)_0%,transparent_60%)] dark:text-white ${isDark ? "dark" : ""}`}
    >
      {/* Шапка навигации */}
      <header className="absolute inset-x-0 top-5 z-10 flex items-center justify-between px-8">
        <button
          className="flex size-11 items-center justify-center rounded-full border border-[#e8e6ea] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-transform duration-150 hover:scale-105 hover:bg-[#f9f9f9] dark:border-white/[0.08] dark:bg-dark-surface"
          type="button"
          onClick={handlePrevStep}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 12L6 8L10 4"
              className="stroke-ink dark:stroke-white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          <span className="whitespace-nowrap text-[13px] font-normal text-[#555] dark:text-white">
            ENJOINT · {currentStep} / {totalSteps}
          </span>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className="relative h-1 w-5 overflow-hidden rounded-full bg-ink/15"
              >
                <div
                  className="h-full rounded-full bg-brand-pink transition-[width] duration-500 ease-in-out"
                  style={{ width: index < currentStep ? "100%" : "0%" }}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          className="flex size-11 items-center justify-center rounded-full border border-[#e8e6ea] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-transform duration-150 hover:scale-105 hover:bg-[#f9f9f9] dark:border-white/[0.08] dark:bg-dark-surface"
          type="button"
          onClick={handleResetToStep1}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M13 1L1 13M1 1L13 13"
              className="stroke-ink dark:stroke-white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </header>

      {/* Белая/Тёмная карточка шага */}
      <div
        key={currentStep}
        className={`relative mt-5 box-border flex h-[min(640px,85vh)] w-[674px] max-w-[90vw] flex-col items-center justify-center rounded-3xl border-0 bg-white px-8 pb-[140px] pt-9 shadow-[0_10px_30px_rgba(0,0,0,0.05)] will-change-transform dark:border dark:border-white/[0.07] dark:bg-dark-card dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] ${slideDirection === "next" ? "animate-[card-slide-next_0.55s_cubic-bezier(0.16,1,0.3,1)_forwards]" : "animate-[card-slide-prev_0.55s_cubic-bezier(0.16,1,0.3,1)_forwards]"}`}
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
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={isDark}
        className="absolute bottom-8 left-8 z-10 flex h-12 cursor-pointer items-center gap-2.5 rounded-full border border-[#e8e6ea] bg-white/95 px-3.5 shadow-[0_6px_20px_rgba(0,0,0,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink dark:border-white/10 dark:bg-dark-surface dark:text-white"
        onClick={handleToggleTheme}
      >
        <span className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-full bg-brand-pink/15 text-brand-pink">
            {isDark ? (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </span>
          <span className="pr-1 text-[13px] font-medium">
            {isDark ? "Light mode" : "Dark mode"}
          </span>
        </span>
      </button>
    </div>
  );
};

export default Register;
