import { ThemeToggleButton } from "../AppHeader";

export function RegistrationHeader({
  currentStep,
  totalSteps,
  onBack,
  onReset,
  isDark,
  onToggleTheme,
}) {
  return (
    <header className="absolute inset-x-0 top-5 z-10 flex items-center justify-between px-8 max-[640px]:px-3">
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
        <div className="flex items-center gap-1.5 max-[420px]:hidden">
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

      <div className="flex items-center gap-2">
        <ThemeToggleButton isDark={isDark} onToggleTheme={onToggleTheme} />
        <button
          aria-label="Reset registration"
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
      </div>
    </header>
  );
}
