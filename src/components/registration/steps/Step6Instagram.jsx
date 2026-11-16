import { useState } from "react";
import { PrimaryButton, StepHeading } from "../RegistrationUI";

const Step6Instagram = ({ onNext, initialData, username }) => {
  const [instaHandle, setInstaHandle] = useState(
    initialData?.instagramHandle || (username ? `@${username}` : "@alexmorgan"),
  );
  const [isConnected, setIsConnected] = useState(
    initialData?.instagramConnected || false,
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
      if (!formatted.startsWith("@")) {
        formatted = "@" + formatted;
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
      instagramHandle: isConnected ? instaHandle : "",
    });
  };

  const handleSkip = () => {
    onNext({
      instagramConnected: false,
      instagramHandle: "",
    });
  };

  return (
    <>
      <StepHeading title="Instagram">
        Connect your Instagram account to share more of your world.
      </StepHeading>

      <div className="my-auto flex w-[329px] max-w-full flex-col items-center">
        {/* Иконка Instagram в розовом круге */}
        <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-brand-pink/10">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect
              x="2"
              y="2"
              width="20"
              height="20"
              rx="6"
              stroke="rgba(255, 127, 192, 1)"
              strokeWidth="1.8"
            />
            <circle
              cx="12"
              cy="12"
              r="4.5"
              stroke="rgba(255, 127, 192, 1)"
              strokeWidth="1.8"
            />
            <circle cx="17.5" cy="6.5" r="1" fill="rgba(255, 127, 192, 1)" />
          </svg>
        </div>

        {/* Форма ввода ника или кнопка/плашка подключения */}
        {isEditing ? (
          <form
            onSubmit={handleConfirmHandle}
            className="relative mb-3 flex h-[50px] w-full max-w-full items-center gap-2 overflow-hidden rounded-full border border-brand-pink bg-white py-0 pr-1.5 pl-[18px] shadow-[0_4px_15px_rgba(255,127,192,0.15)] dark:border-white/[0.08] dark:bg-dark-surface"
          >
            <span className="flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="6"
                  stroke="rgba(255, 127, 192, 1)"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4.5"
                  stroke="rgba(255, 127, 192, 1)"
                  strokeWidth="2"
                />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1.2"
                  fill="rgba(255, 127, 192, 1)"
                />
              </svg>
            </span>
            <input
              type="text"
              className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-[15px] font-medium text-ink outline-none dark:text-white"
              placeholder="@username"
              value={instaHandle}
              onChange={(e) => setInstaHandle(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="flex h-[38px] shrink-0 items-center justify-center rounded-full border-0 bg-brand-pink px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
            >
              Connect
            </button>
          </form>
        ) : isConnected ? (
          <button
            type="button"
            className="mb-3 flex h-[50px] w-full max-w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border border-[#e8e6ea] bg-white px-[18px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] transition-all duration-200 hover:-translate-y-px hover:border-brand-pink/60 dark:border-white/[0.08] dark:bg-dark-surface"
            onClick={handleStartConnect}
          >
            <span className="flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="6"
                  stroke="rgba(255, 127, 192, 1)"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4.5"
                  stroke="rgba(255, 127, 192, 1)"
                  strokeWidth="2"
                />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1.2"
                  fill="rgba(255, 127, 192, 1)"
                />
              </svg>
            </span>
            <span className="text-[15px] font-medium text-ink dark:text-white">
              Instagram connected • {instaHandle}
            </span>
          </button>
        ) : (
          <button
            type="button"
            className="mb-3 flex h-[50px] w-full max-w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border border-[#e8e6ea] bg-white px-[18px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] transition-all duration-200 hover:-translate-y-px hover:border-brand-pink/60 dark:border-white/[0.08] dark:bg-dark-surface"
            onClick={handleStartConnect}
          >
            <span className="flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="6"
                  stroke="rgba(255, 127, 192, 1)"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4.5"
                  stroke="rgba(255, 127, 192, 1)"
                  strokeWidth="2"
                />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1.2"
                  fill="rgba(255, 127, 192, 1)"
                />
              </svg>
            </span>
            <span className="text-[15px] font-medium text-ink dark:text-white">
              Connect with Instagram
            </span>
          </button>
        )}

        {/* Единственное сообщение статуса под кнопкой */}
        <div className="flex min-h-5 items-center justify-center">
          {isConnected ? (
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
              <span>Example account connected.</span>
            </div>
          ) : (
            <p className="m-0 text-center text-[13px] font-normal text-muted dark:text-white/70">
              No account connected. You can connect later.
            </p>
          )}
        </div>

        {/* Кнопка Next и ссылка Skip */}
        <div className="absolute inset-x-0 bottom-10 flex h-[86px] flex-col items-center justify-start">
          <PrimaryButton type="button" onClick={handleNext}>Next</PrimaryButton>

          <button
            type="button"
            className="mt-2 cursor-pointer border-0 bg-transparent p-0 text-[14px] font-normal text-ink underline transition-opacity hover:opacity-70 dark:text-white"
            onClick={handleSkip}
          >
            Skip
          </button>
        </div>
      </div>
    </>
  );
};

export default Step6Instagram;
