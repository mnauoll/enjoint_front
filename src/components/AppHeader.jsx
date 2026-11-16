import { ChevronDown, Moon, Search, Sun, X } from 'lucide-react';

const navigationTabs = ['Explore Map', 'Chat', 'My Events', 'Friends', 'Settings'];

export default function AppHeader({
  activeTab,
  onTabChange,
  isDark,
  onToggleTheme,
  action = 'filters',
  fixed = false,
}) {
  return (
    <header
      className={`${fixed ? 'fixed' : 'relative'} top-0 right-0 left-0 z-30 flex h-[82px] shrink-0 items-start justify-between bg-[linear-gradient(180deg,rgba(18,20,20,.94)_0%,rgba(32,34,33,.72)_48%,rgba(32,34,33,.24)_78%,rgba(32,34,33,0)_100%)] px-8 pt-4 pointer-events-auto select-none backdrop-blur-[6px] max-[640px]:gap-[10px] max-[640px]:px-3`}
    >
      <div className="z-10 flex shrink-0 items-center gap-[30px] max-[640px]:gap-[10px]">
        <span className="font-sans text-[27px] leading-[140%] font-bold tracking-wide text-white max-[640px]:text-[20px]">
          ENJOINT
        </span>
        <div className="flex h-[46px] w-[330px] shrink-0 items-center gap-3 rounded-[24px] border border-gray-100 bg-[#F7F8FA] px-[18px] shadow-md transition-colors dark:border-white/5 dark:bg-[#1A212B] max-[640px]:w-[150px] max-[640px]:px-3">
          <Search className="h-4 w-4 shrink-0 text-[#AD316B] dark:text-[#FF7FC0]" />
          <input
            type="text"
            aria-label="Location"
            placeholder="Poznań, Poland"
            defaultValue="Poznań, Poland"
            className="w-full bg-transparent font-sans text-sm text-[#262626] outline-none placeholder:text-[#262626]/60 dark:text-white dark:placeholder:text-white/60"
          />
          <button
            type="button"
            aria-label="Clear location"
            className="cursor-pointer text-gray-400 hover:text-[#262626] dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <nav
        className="absolute top-7 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-7 font-sans text-[15px] leading-none font-semibold min-[1024px]:flex"
        aria-label="Main navigation"
      >
        {navigationTabs.map((tab) => (
          onTabChange ? (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`cursor-pointer whitespace-nowrap transition-colors ${
                activeTab === tab ? 'text-[#FF7FC0]' : 'text-white hover:text-[#FF7FC0]'
              }`}
            >
              {tab}
            </button>
          ) : (
            <span
              key={tab}
              aria-current={activeTab === tab ? 'page' : undefined}
              className={`whitespace-nowrap transition-colors ${
                activeTab === tab ? 'text-[#FF7FC0]' : 'text-white'
              }`}
            >
              {tab}
            </span>
          )
        ))}
      </nav>

      <div className="relative z-10 flex shrink-0 items-center gap-5 max-[640px]:gap-[7px]">
        {action === 'theme' ? (
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            className="flex h-[38px] cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 font-sans text-sm font-semibold text-[#262626] shadow-md transition-colors hover:bg-gray-50 max-[640px]:h-9 max-[640px]:w-9 max-[640px]:justify-center max-[640px]:px-0"
          >
            {isDark ? (
              <>
                <Sun className="h-4 w-4 text-amber-500" />
                <span className="max-[640px]:hidden">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-indigo-500" />
                <span className="max-[640px]:hidden">Dark</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            className="flex h-[38px] cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 font-sans text-sm font-semibold text-[#262626] shadow-md transition-colors hover:bg-gray-50 max-[640px]:h-9 max-[640px]:px-3 max-[640px]:text-xs"
          >
            <span>Filters</span>
            <ChevronDown className="h-4 w-4 text-[#262626]" />
          </button>
        )}

        <div className="relative flex h-[40px] w-[43px] shrink-0 items-center justify-center max-[640px]:hidden">
          <div className="pointer-events-none absolute top-[-16px] left-0 z-20 h-[82px] w-[43px]">
            <svg width="43" height="82" viewBox="0 0 43 82" fill="none" aria-hidden="true">
              <path d="M1.5 0H41.5V80L21.5 68L1.5 80V0Z" fill="#AD316B" stroke="#FF7FC0" strokeWidth="3" />
              <line x1="13" y1="0" x2="13" y2="76" stroke="#FF7FC0" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="30" y1="0" x2="30" y2="76" stroke="#FF7FC0" strokeWidth="2" strokeDasharray="3 3" />
            </svg>
          </div>
        </div>

        <div className="flex h-[38px] w-[38px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white font-sans text-xs font-bold text-[#262626] shadow-md dark:border-[#FF7FC0]/40 dark:bg-[#2A1E2A] dark:text-[#FF7FC0] max-[640px]:h-[30px] max-[640px]:w-[30px]">
          AM
        </div>
      </div>
    </header>
  );
}
