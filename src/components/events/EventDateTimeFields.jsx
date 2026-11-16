import { useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, X } from "lucide-react";

function getLocalDateParts(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };
}

function parseEventDate(value) {
  const [day, month, year] = String(value || "").split(".").map(Number);
  if (!day || !month || !year) return null;
  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatEventDate(date) {
  const { year, month, day } = getLocalDateParts(date);
  return `${String(day).padStart(2, "0")}.${String(month + 1).padStart(2, "0")}.${year}`;
}

function WheelColumn({ label, values, value, onChange, isDark }) {
  const rowHeight = 40;
  const selectedIndex = values.indexOf(value);

  return (
    <div className="min-w-0 flex-1 text-center">
      <span className={`mb-2 block text-[11px] ${isDark ? "text-[#a6abb4]" : "text-[#858991]"}`}>
        {label}
      </span>
      <div
        aria-label={label}
        className="relative box-border h-[120px] touch-pan-y overflow-y-auto py-10 [scrollbar-width:none]"
        onScroll={(event) => {
          const index = Math.max(
            0,
            Math.min(values.length - 1, Math.round(event.currentTarget.scrollTop / rowHeight)),
          );
          if (values[index] !== value) onChange(values[index]);
        }}
        ref={(element) => {
          if (element && selectedIndex >= 0 && element.dataset.initialized !== "true") {
            element.scrollTop = selectedIndex * rowHeight;
            element.dataset.initialized = "true";
          }
        }}
        role="group"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {values.map((item) => (
          <button
            aria-pressed={item === value}
            className="block h-10 w-full cursor-pointer snap-center border-0 bg-transparent p-0"
            key={item}
            onClick={() => onChange(item)}
            style={{
              color: item === value ? "#ff65ac" : isDark ? "rgba(255,255,255,.52)" : "#9a9da3",
              fontSize: item === value ? 24 : 18,
              fontWeight: item === value ? 600 : 400,
            }}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function EventDateTimeFields({ date, time, onChange, isDark }) {
  const [picker, setPicker] = useState(null);
  const [draftDate, setDraftDate] = useState(() => parseEventDate(date) || new Date());
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const initialDate = parseEventDate(date) || new Date();
    return new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
  });
  const [draftHour, setDraftHour] = useState(() => {
    const match = String(time || "").match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    return match ? String(Number(match[1])) : "10";
  });
  const [draftMinute, setDraftMinute] = useState(() => {
    const match = String(time || "").match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    return match ? match[2] : "00";
  });
  const [draftPeriod, setDraftPeriod] = useState(() => {
    const match = String(time || "").match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    return match ? match[3].toUpperCase() : "AM";
  });

  const dateParts = getLocalDateParts(draftDate);
  const monthFirstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const monthOffset = (monthFirstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const calendarDays = [
    ...Array.from({ length: monthOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  const monthName = new Intl.DateTimeFormat("en", { month: "long" }).format(calendarMonth);
  const timeHours = Array.from({ length: 12 }, (_, index) => String(index + 1));
  const timeMinutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0"));
  const pickerCardClass = `relative rounded-[22px] p-6 shadow-2xl ${
    isDark ? "bg-[#151a22] text-white" : "bg-white text-[#262626]"
  }`;

  const openDatePicker = () => {
    const selectedDate = parseEventDate(date) || new Date();
    setDraftDate(selectedDate);
    setCalendarMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    setPicker("date");
  };

  const openTimePicker = () => {
    const match = String(time || "").match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      setDraftHour(String(Number(match[1])));
      setDraftMinute(match[2]);
      setDraftPeriod(match[3].toUpperCase());
    }
    setPicker("time");
  };

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-xs font-medium">
          Date
          <button
            className={`flex h-10 items-center justify-between rounded-full border px-3 text-left text-xs font-normal transition hover:border-[#ff7fc0] ${
              isDark ? "border-[#303843] bg-[#1b222c]" : "border-gray-200 bg-gray-50"
            }`}
            onClick={openDatePicker}
            type="button"
          >
            <span>{date || "Select date"}</span>
            <CalendarDays className="text-[#ff65ac]" size={15} />
          </button>
        </label>
        <label className="grid gap-1 text-xs font-medium">
          Start time
          <button
            className={`flex h-10 items-center justify-between rounded-full border px-3 text-left text-xs font-normal transition hover:border-[#ff7fc0] ${
              isDark ? "border-[#303843] bg-[#1b222c]" : "border-gray-200 bg-gray-50"
            }`}
            onClick={openTimePicker}
            type="button"
          >
            <span>{time || "Select time"}</span>
            <Clock3 className="text-[#ff65ac]" size={15} />
          </button>
        </label>
      </div>

      {picker && createPortal(
        <div
          className="fixed inset-0 z-[1200] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPicker(null);
          }}
        >
          {picker === "date" ? (
            <section
              aria-labelledby="edit-event-date-picker-title"
              aria-modal="true"
              className={`${pickerCardClass} w-[min(366px,calc(100vw-40px))]`}
              onMouseDown={(event) => event.stopPropagation()}
              role="dialog"
            >
              <button
                aria-label="Close date picker"
                className="absolute right-4 top-4 opacity-60 hover:opacity-100"
                onClick={() => setPicker(null)}
                type="button"
              >
                <X size={17} />
              </button>
              <h3 className="mb-2 text-center text-sm font-medium" id="edit-event-date-picker-title">Date</h3>
              <div className="flex min-h-[62px] items-center justify-between">
                <button aria-label="Previous month" className="p-2" onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))} type="button">
                  <ChevronLeft size={20} />
                </button>
                <div className="text-center">
                  <div className="text-[30px] leading-none font-medium text-[#ff70b6]">{calendarMonth.getFullYear()}</div>
                  <div className="mt-1 text-[13px] text-[#ff70b6]">{monthName}</div>
                </div>
                <button aria-label="Next month" className="p-2" onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))} type="button">
                  <ChevronRight size={20} />
                </button>
              </div>
              <div
                aria-label={`${monthName} ${calendarMonth.getFullYear()}`}
                className="mt-3 grid grid-cols-7 justify-items-center gap-y-0.5"
              >
                {calendarDays.map((day, index) => {
                  if (day === null) return <span aria-hidden="true" key={`empty-${index}`} />;
                  const selected =
                    day === dateParts.day &&
                    calendarMonth.getMonth() === dateParts.month &&
                    calendarMonth.getFullYear() === dateParts.year;
                  return (
                    <button
                      aria-label={new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day).toLocaleDateString("en", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                      aria-pressed={selected}
                      className="size-[34px] rounded-full text-xs"
                      key={day}
                      onClick={() => setDraftDate(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day))}
                      style={{
                        background: selected ? "linear-gradient(135deg, #ff7fc0, #ff69b4)" : "transparent",
                        color: selected ? "#fff" : isDark ? "#fff" : "#171717",
                        fontWeight: selected ? 600 : 400,
                      }}
                      type="button"
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              <button
                className="mt-6 h-12 w-full rounded-full bg-gradient-to-r from-[#ff7fc0] to-[#ff813e] text-sm text-white"
                onClick={() => {
                  onChange("date", formatEventDate(draftDate));
                  setPicker(null);
                }}
                type="button"
              >
                Save
              </button>
            </section>
          ) : (
            <section
              aria-labelledby="edit-event-time-picker-title"
              aria-modal="true"
              className={`${pickerCardClass} w-[min(350px,calc(100vw-40px))]`}
              onMouseDown={(event) => event.stopPropagation()}
              role="dialog"
            >
              <button
                aria-label="Close time picker"
                className="absolute right-4 top-4 opacity-60 hover:opacity-100"
                onClick={() => setPicker(null)}
                type="button"
              >
                <X size={17} />
              </button>
              <h3 className="mb-1.5 text-center text-base font-semibold" id="edit-event-time-picker-title">Time</h3>
              <p className={`mb-5 text-center text-[11px] ${isDark ? "text-[#a6abb4]" : "text-[#858991]"}`}>Scroll to select a time</p>
              <div className="relative flex items-center gap-2">
                <div className={`pointer-events-none absolute inset-x-0 top-[63px] z-0 h-10 border-y ${isDark ? "border-white/10" : "border-gray-200"}`} />
                <WheelColumn isDark={isDark} label="Hour" onChange={setDraftHour} value={draftHour} values={timeHours} />
                <span className="pt-6 text-2xl text-[#ff70b6]">:</span>
                <WheelColumn isDark={isDark} label="Minute" onChange={setDraftMinute} value={draftMinute} values={timeMinutes} />
                <WheelColumn isDark={isDark} label="AM/PM" onChange={setDraftPeriod} value={draftPeriod} values={["AM", "PM"]} />
              </div>
              <button
                className="mt-6 h-12 w-full rounded-full bg-gradient-to-r from-[#ff7fc0] to-[#ff813e] text-sm text-white"
                onClick={() => {
                  onChange("time", `${Number(draftHour)}:${draftMinute} ${draftPeriod}`);
                  setPicker(null);
                }}
                type="button"
              >
                Save
              </button>
            </section>
          )}
        </div>,
        document.body,
      )}
    </>
  );
}
