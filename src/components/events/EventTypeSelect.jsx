import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

export default function EventTypeSelect({ id, label, value, onChange, options, isDark }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const gap = 6;
      const padding = 8;
      const below = window.innerHeight - rect.bottom - gap - padding;
      const above = rect.top - gap - padding;
      const openAbove = below < 160 && above > below;
      const maxHeight = Math.min(220, Math.max(0, openAbove ? above : below));
      setMenuPosition({
        left: rect.left,
        top: openAbove ? Math.max(padding, rect.top - gap - maxHeight) : rect.bottom + gap,
        width: rect.width,
        maxHeight,
      });
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const selectedIndex = options.indexOf(value);
    menuRef.current?.querySelectorAll('[role="option"]')[
      selectedIndex >= 0 ? selectedIndex : 0
    ]?.focus();
  }, [isOpen, options, value]);

  const moveFocus = (event, direction) => {
    const items = Array.from(menuRef.current?.querySelectorAll('[role="option"]') || []);
    const index = items.indexOf(event.currentTarget);
    items[(index + direction + items.length) % items.length]?.focus();
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-medium" htmlFor={id} id={`${id}-label`}>{label}</label>
      <div className="relative" ref={containerRef}>
        <button
          aria-controls={`${id}-options`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className={`flex h-10 w-full items-center justify-between rounded-full border px-4 pr-10 text-left text-xs outline-none transition focus:border-[#ff7fc0] ${
            isDark ? "border-[#69495c] bg-[#382a35] text-white" : "border-[#efd3df] bg-white/80 text-[#262626]"
          }`}
          id={id}
          onClick={() => setIsOpen((open) => !open)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              setIsOpen(true);
            } else if (event.key === "Escape" && isOpen) {
              event.preventDefault();
              setIsOpen(false);
            }
          }}
          ref={triggerRef}
          type="button"
        >
          <span>{value || "Select a type"}</span>
          <ChevronDown aria-hidden="true" className="absolute right-3.5 text-current/60" size={15} />
        </button>
      </div>
      {isOpen && menuPosition && createPortal(
        <div
          aria-labelledby={`${id}-label`}
          className={`fixed z-[1200] overflow-y-auto rounded-[14px] border p-[5px] shadow-xl ${
            isDark ? "border-white/10 bg-[#382a35]" : "border-[#efd3df] bg-white"
          }`}
          id={`${id}-options`}
          ref={menuRef}
          role="listbox"
          style={{
            left: menuPosition.left,
            top: menuPosition.top,
            width: menuPosition.width,
            maxHeight: menuPosition.maxHeight,
          }}
        >
          {options.map((option) => (
            <button
              aria-selected={value === option}
              className="event-type-option block w-full rounded-[9px] border-0 px-3 py-2.5 text-left text-xs"
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  moveFocus(event, 1);
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  moveFocus(event, -1);
                } else if (event.key === "Escape") {
                  event.preventDefault();
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }
              }}
              role="option"
              style={{
                background: value === option ? "rgba(255,127,192,.16)" : "transparent",
                color: isDark ? "#fff" : "#262626",
                cursor: "pointer",
              }}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}
