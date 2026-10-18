import React, { useState, useEffect } from "react";

const Step7Location = ({ onNext, initialData }) => {
  const [locationEnabled, setLocationEnabled] = useState(
    initialData?.locationEnabled !== undefined
      ? initialData.locationEnabled
      : true,
  );
  const [isManual, setIsManual] = useState(
    initialData?.isManualLocation || false,
  );
  const [city, setCity] = useState(initialData?.city || "");
  const [coords, setCoords] = useState(initialData?.coords || null);

  // Запрос геолокации браузера при включении переключателя
  useEffect(() => {
    if (locationEnabled && !isManual && !coords) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoords({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.log("Geolocation permission denied or error:", error);
          },
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
      city: isManual ? city : "",
      coords: !isManual && locationEnabled ? coords : null,
    });
  };

  const handleSkip = () => {
    onNext({
      locationEnabled: false,
      isManualLocation: false,
      city: "",
      coords: null,
    });
  };

  return (
    <>
      <div className="mb-5 flex h-[90px] w-full flex-col items-center gap-1.5">
        <h1 className="m-0 text-center text-[56px] leading-[1.1] font-bold text-ink dark:text-white">
          Your Location
        </h1>
        <p className="m-0 text-center text-base font-normal text-ink dark:text-white">
          Enable your location to discover people nearby.
        </p>
      </div>

      <div className="my-auto flex w-[329px] max-w-full flex-col items-center">
        {/* Иконка локации в круглом фоне */}
        <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-brand-pink/10">
          <svg width="28" height="32" viewBox="0 0 20 24" fill="none">
            <path
              d="M10 1C5.02944 1 1 5.02944 1 10C1 16.5 10 23 10 23C10 23 19 16.5 19 10C19 5.02944 14.9706 1 10 1Z"
              stroke="rgba(255, 127, 192, 1)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="10"
              cy="10"
              r="3.5"
              stroke="rgba(255, 127, 192, 1)"
              strokeWidth="1.8"
            />
          </svg>
        </div>

        {/* Переключение: Вариант A (Тумблер Доступа) или Вариант B (Ручной ввод города) */}
        {!isManual ? (
          <div className="flex w-full max-w-full flex-col items-center">
            {/* Карточка переключателя (Location Access) */}
            <div className="mb-3 flex h-[50px] w-full max-w-full items-center justify-between rounded-full bg-brand-pink/10 px-[18px] dark:border dark:border-white/[0.08] dark:bg-dark-surface">
              <span className="text-[15px] font-medium text-ink dark:text-white">
                Location access
              </span>

              {/* Тумблер 44px x 26px по параметрам Figma */}
              <button
                type="button"
                className={`flex h-[26px] w-11 cursor-pointer items-center rounded-full border-0 p-[3px] transition-colors duration-200 ${locationEnabled ? "justify-end bg-brand-pink" : "justify-start bg-[#e8e6ea]"}`}
                onClick={handleToggle}
              >
                <div className="size-5 rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.15)]" />
              </button>
            </div>

            {/* Сообщение о статусе геолокации */}
            <div className="flex min-h-[38px] flex-col items-center gap-1">
              {locationEnabled ? (
                <>
                  <div className="flex items-center gap-1.5 text-[13px] font-normal text-success">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle
                        cx="8"
                        cy="8"
                        r="7"
                        stroke="rgba(50, 129, 70, 1)"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M5 8L7 10L11 6"
                        stroke="rgba(50, 129, 70, 1)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Location access allowed.</span>
                  </div>
                  <p className="m-0 text-center text-[12px] font-normal text-muted dark:text-white/70">
                    Your location helps you find people nearby.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 text-[13px] font-normal text-muted dark:text-white/70">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle
                        cx="8"
                        cy="8"
                        r="7"
                        stroke="rgba(119, 119, 119, 1)"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M5 8H11"
                        stroke="rgba(119, 119, 119, 1)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>Skipped. Continue without location.</span>
                  </div>
                  <p className="m-0 text-center text-[12px] font-normal text-muted dark:text-white/70">
                    Location access is not enabled. You can add it later.
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          /* Форма ручного ввода города "What is your city?" */
          <div className="mb-2 flex w-full max-w-full flex-col gap-1.5">
            <label className="text-center text-[14px] font-medium text-ink dark:text-white">
              What is your city?
            </label>
            <div className="flex h-[50px] w-full items-center gap-3 rounded-full border border-transparent bg-white px-[18px] shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:border-white/[0.08] dark:bg-dark-surface">
              <span className="flex items-center justify-center">
                <svg width="16" height="18" viewBox="0 0 20 24" fill="none">
                  <path
                    d="M10 1C5.02944 1 1 5.02944 1 10C1 16.5 10 23 10 23C10 23 19 16.5 19 10C19 5.02944 14.9706 1 10 1Z"
                    stroke="rgba(119, 119, 119, 1)"
                    strokeWidth="1.6"
                  />
                  <circle
                    cx="10"
                    cy="10"
                    r="3"
                    stroke="rgba(119, 119, 119, 1)"
                    strokeWidth="1.6"
                  />
                </svg>
              </span>
              <input
                type="text"
                className="w-full border-0 bg-transparent text-[15px] font-normal text-ink outline-none dark:text-white"
                placeholder="Enter your city (e.g. Warsaw)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Нижний зафиксированный блок с кнопками */}
        <div className="absolute inset-x-0 bottom-10 flex h-[86px] flex-col items-center justify-start">
          <button
            type="button"
            className="flex h-14 w-[295px] max-w-full items-center justify-center rounded-3xl border-0 bg-[linear-gradient(90deg,#ff7fc0_0%,#ff813e_100%)] text-xl font-medium text-white transition-[transform,opacity] duration-150 hover:opacity-95 active:scale-[0.98] dark:bg-[linear-gradient(135deg,#ff7fc0_0%,#ff813e_100%)] dark:text-[#141414]"
            onClick={handleNext}
          >
            Next
          </button>

          <div className="mt-2.5 flex items-baseline justify-center gap-4">
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-0 text-[14px] leading-[18px] font-normal text-ink underline transition-opacity hover:opacity-70 dark:text-white"
              onClick={handleSkip}
            >
              Skip
            </button>

            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-0 text-[14px] leading-[18px] font-normal text-ink underline transition-opacity hover:opacity-70 dark:text-white"
              onClick={() => setIsManual((prev) => !prev)}
            >
              {isManual ? "Use Auto Location" : "Enter Location Manually"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step7Location;
