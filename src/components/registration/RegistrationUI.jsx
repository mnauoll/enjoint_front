export function StepHeading({ title, children }) {
  return (
    <div className="mb-5 flex h-[90px] w-full flex-col items-center gap-1.5">
      <h1 className="m-0 text-center text-[56px] leading-[1.1] font-bold text-ink dark:text-white">
        {title}
      </h1>
      <p className="m-0 text-center text-base font-normal text-ink dark:text-white">
        {children}
      </p>
    </div>
  );
}

export function PrimaryButton({ type, onClick, children }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="flex h-14 w-[295px] max-w-full items-center justify-center rounded-3xl border-0 bg-[linear-gradient(90deg,#ff7fc0_0%,#ff813e_100%)] text-xl font-medium text-white transition-[transform,opacity] duration-150 hover:opacity-95 active:scale-[0.98] dark:bg-[linear-gradient(135deg,#ff7fc0_0%,#ff813e_100%)] dark:text-[#141414]"
    >
      {children}
    </button>
  );
}
