import React, { useState } from "react";

const Step8Notifications = ({ onFinish, initialData }) => {
  const [pushEnabled, setPushEnabled] = useState(
    initialData?.pushEnabled !== undefined ? initialData.pushEnabled : true,
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
      <div className="mb-5 flex h-[90px] w-full flex-col items-center gap-1.5">
        <h1 className="m-0 text-center text-[56px] leading-[1.1] font-bold text-ink dark:text-white">
          Notifications
        </h1>
        <p className="m-0 text-center text-base font-normal text-ink dark:text-white">
          Get push notifications when you get a match or receive a message.
        </p>
      </div>

      <div className="my-auto flex w-[329px] max-w-full flex-col items-center">
        {/* Векторный логотип колокольчика из Figma */}
        <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-brand-pink/10">
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
        <div className="mb-3 flex h-[50px] w-full max-w-full items-center justify-between rounded-full bg-brand-pink/10 px-[18px] dark:border dark:border-white/[0.08] dark:bg-dark-surface">
          <span className="text-[15px] font-medium text-ink dark:text-white">
            Push notifications
          </span>

          <button
            type="button"
            className={`flex h-[26px] w-11 cursor-pointer items-center rounded-full border-0 p-[3px] transition-colors duration-200 ${pushEnabled ? "justify-end bg-brand-pink" : "justify-start bg-[#e8e6ea]"}`}
            onClick={handleToggle}
          >
            <div className="size-5 rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.15)]" />
          </button>
        </div>

        {/* Сообщение статуса под плашкой */}
        <div className="flex min-h-[38px] flex-col items-center gap-1">
          {pushEnabled ? (
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
                <span>Notifications enabled.</span>
              </div>
              <p className="m-0 text-center text-[12px] font-normal text-muted dark:text-white/70">
                You’re ready to stay in the loop.
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
                <span>Skipped. Continue without notifications.</span>
              </div>
              <p className="m-0 text-center text-[12px] font-normal text-muted dark:text-white/70">
                Notifications are off. You can turn them on later.
              </p>
            </>
          )}
        </div>

        {/* Зафиксированные действия снизу */}
        <div className="absolute inset-x-0 bottom-10 flex h-[86px] flex-col items-center justify-start">
          <button
            type="button"
            className="flex h-14 w-[295px] max-w-full items-center justify-center rounded-3xl border-0 bg-[linear-gradient(90deg,#ff7fc0_0%,#ff813e_100%)] text-xl font-medium text-white transition-[transform,opacity] duration-150 hover:opacity-95 active:scale-[0.98] dark:bg-[linear-gradient(135deg,#ff7fc0_0%,#ff813e_100%)] dark:text-[#141414]"
            onClick={handleFinish}
          >
            Finish
          </button>
        </div>
      </div>
    </>
  );
};

export default Step8Notifications;
