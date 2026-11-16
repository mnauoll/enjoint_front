export function RegistrationHeader({ currentStep, totalSteps, onBack, onReset }) {
  return (
    <header className="absolute inset-x-0 top-5 z-10 flex items-center justify-between px-8">
      <button
        className="flex size-11 items-center justify-center rounded-full border border-[#e8e6ea] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-transform duration-150 hover:scale-105 hover:bg-[#f9f9f9] dark:border-white/[0.08] dark:bg-dark-surface"
        type="button"
        onClick={onBack}
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
        onClick={onReset}
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
  );
}

export function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className="absolute bottom-8 left-8 z-10 flex h-12 cursor-pointer items-center gap-2.5 rounded-full border border-[#e8e6ea] bg-white/95 px-3.5 shadow-[0_6px_20px_rgba(0,0,0,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink dark:border-white/10 dark:bg-dark-surface dark:text-white"
      onClick={onToggle}
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
  );
}
