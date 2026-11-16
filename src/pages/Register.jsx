import { useState, useEffect } from "react";
import Step1Account from "../components/registration/steps/Step1Account";
import Step2Verification from "../components/registration/steps/Step2Verification";
import Step3Profile from "../components/registration/steps/Step3Profile";
import Step4PhotoBio from "../components/registration/steps/Step4PhotoBio";
import Step5Interests from "../components/registration/steps/Step5Interests";
import Step6Instagram from "../components/registration/steps/Step6Instagram";
import Step7Location from "../components/registration/steps/Step7Location";
import Step8Notifications from "../components/registration/steps/Step8Notifications";
import {
  RegistrationHeader,
  ThemeToggle,
} from "../components/registration/RegistrationControls";

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

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

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
      <RegistrationHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={handlePrevStep}
        onReset={handleResetToStep1}
      />

      {/* Белая/Тёмная карточка шага */}
      <div
        key={currentStep}
        className={`relative mt-5 box-border flex h-[min(640px,85vh)] w-[674px] max-w-[90vw] flex-col items-center justify-center rounded-3xl border-0 bg-white px-8 pb-[140px] pt-9 shadow-[0_10px_30px_rgba(0,0,0,0.05)] will-change-transform dark:border dark:border-white/[0.07] dark:bg-dark-card dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] ${slideDirection === "next" ? "animate-[card-slide-next_0.55s_cubic-bezier(0.16,1,0.3,1)_forwards]" : "animate-[card-slide-prev_0.55s_cubic-bezier(0.16,1,0.3,1)_forwards]"}`}
      >
        {currentStep === 1 && (
          <Step1Account
            onNext={handleNextStep}
            initialData={registrationData}
          />
        )}

        {currentStep === 2 && (
          <Step2Verification
            email={registrationData.email}
            onSuccess={handleNextStep}
          />
        )}

        {currentStep === 3 && (
          <Step3Profile
            onNext={handleNextStep}
            initialData={registrationData}
          />
        )}

        {currentStep === 4 && (
          <Step4PhotoBio
            onNext={handleNextStep}
            initialData={registrationData}
          />
        )}

        {currentStep === 5 && (
          <Step5Interests
            onNext={handleNextStep}
            initialData={registrationData}
          />
        )}

        {currentStep === 6 && (
          <Step6Instagram
            onNext={handleNextStep}
            initialData={registrationData}
            username={registrationData.username}
          />
        )}

        {currentStep === 7 && (
          <Step7Location
            onNext={handleNextStep}
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

      <ThemeToggle isDark={isDark} onToggle={() => setIsDark((prev) => !prev)} />
    </div>
  );
};

export default Register;
