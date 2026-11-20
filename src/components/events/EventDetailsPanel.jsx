import { useState } from "react";
import {
  Bookmark,
  CalendarDays,
  MapPin,
  Users,
  X,
} from "lucide-react";
import {
  getEventCapacity,
  getEventLocation,
  getEventPrice,
  getEventSchedule,
} from "./eventUtils";

function ParticipantAvatar({ name, isDark }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
        isDark ? "bg-[#3a2938] text-[#ff9acb]" : "bg-[#ffe5f1] text-[#b83272]"
      }`}
      title={name}
    >
      {initials}
    </span>
  );
}

export default function EventDetailsPanel({
  event,
  isDark,
  participantCount,
  isJoined,
  onClose,
  onJoin,
}) {
  const [isSaved, setIsSaved] = useState(false);
  const capacity = getEventCapacity(event);
  const participants = event.participants || [];
  const host = event.host || "Event host";
  const description =
    event.description ||
    "Join this event to meet new people and enjoy a good time together.";
  const canJoin = !isJoined && participantCount < capacity;

  return (
    <aside
      aria-label="Event details"
      className={`fixed inset-y-3 right-3 z-40 flex w-[360px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-3xl border font-sans shadow-2xl ${
        isDark
          ? "border-white/10 bg-[#11161d] text-white"
          : "border-gray-200 bg-white text-[#262626]"
      }`}
    >
      <div className="flex items-center justify-between px-4 pt-4">
        <span className={`text-xs ${isDark ? "text-white/55" : "text-gray-500"}`}>
          Event details
        </span>
        <div className="flex items-center gap-2">
          <button
            aria-label={isSaved ? "Remove bookmark" : "Bookmark event"}
            aria-pressed={isSaved}
            className={`rounded-full p-1.5 transition hover:bg-black/5 dark:hover:bg-white/10 ${
              isSaved ? "text-[#ff65ac]" : "text-current/70"
            }`}
            onClick={() => setIsSaved((saved) => !saved)}
            type="button"
          >
            <Bookmark fill={isSaved ? "currentColor" : "none"} size={16} />
          </button>
          <button
            aria-label="Close event details"
            className="rounded-full p-1.5 text-current/70 transition hover:bg-black/5 dark:hover:bg-white/10"
            onClick={onClose}
            type="button"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-[#ff65ac]">
          {event.category || event.type || "Event"}
        </p>
        <h2 className="mt-2 text-xl leading-tight font-bold">{event.title}</h2>

        <p className={`mt-3 text-xs ${isDark ? "text-white/60" : "text-gray-500"}`}>
          Hosted by <span className="font-semibold text-current">{host}</span>
        </p>

        <div
          className={`mt-4 space-y-3 rounded-2xl p-3 text-xs ${
            isDark ? "bg-[#202630]" : "bg-gray-100"
          }`}
        >
          <div className="flex items-start gap-2.5">
            <CalendarDays className="mt-0.5 shrink-0 text-[#ff65ac]" size={15} />
            <div>
              <p className="font-semibold">{getEventSchedule(event)}</p>
              <p className={`mt-1 text-[10px] ${isDark ? "text-white/55" : "text-gray-500"}`}>
                Local time
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 shrink-0 text-[#ff65ac]" size={15} />
            <div>
              <p className="font-semibold">{getEventLocation(event)}</p>
              {event.city && event.address && (
                <p className={`mt-1 text-[10px] ${isDark ? "text-white/55" : "text-gray-500"}`}>
                  {event.city}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Users className="shrink-0 text-[#ff65ac]" size={15} />
            <span>
              {participantCount} / {capacity} people
            </span>
            <span className="font-semibold">· {event.womenOnly ? "Women only" : getEventPrice(event)}</span>
          </div>
        </div>

        <section className="mt-4">
          <h3 className="text-sm font-bold">About this event</h3>
          <p className={`mt-2 text-xs leading-relaxed ${isDark ? "text-white/65" : "text-gray-600"}`}>
            {description}
          </p>
        </section>

        <section className="mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Participants ({participantCount})</h3>
            <span className="text-[10px] font-semibold text-[#ff65ac]">
              {participants.length > 0 ? "See all" : ""}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            {(participants.length > 0 ? participants.slice(0, 5) : [host]).map((person) => (
              <ParticipantAvatar key={person} name={person} isDark={isDark} />
            ))}
            {participantCount > 5 && (
              <span className={`text-[10px] ${isDark ? "text-white/55" : "text-gray-500"}`}>
                +{participantCount - 5}
              </span>
            )}
          </div>
          <p className={`mt-2 text-[10px] ${isDark ? "text-white/55" : "text-gray-500"}`}>
            {event.womenOnly ? "Women only" : "All genders"} · Ages 18+
          </p>
        </section>

        {event.comments && (
          <section className="mt-4 border-t border-current/10 pt-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Comments</h3>
              <span className="text-[10px] font-semibold text-[#ff65ac]">View all</span>
            </div>
            <p className={`mt-2 text-xs ${isDark ? "text-white/65" : "text-gray-600"}`}>
              {event.comments}
            </p>
          </section>
        )}
      </div>

      <div
        className={`flex items-center justify-between gap-3 border-t px-4 py-3 ${
          isDark ? "border-white/10" : "border-gray-200"
        }`}
      >
        <div>
          <p className="text-sm font-bold">
            {isJoined ? "You're in!" : getEventPrice(event) === "Free" ? "Free to join" : getEventPrice(event)}
          </p>
          <p className={`mt-1 text-[10px] ${isDark ? "text-white/55" : "text-gray-500"}`}>
            {isJoined
              ? "You joined this event"
              : `${Math.max(0, capacity - participantCount)} spots left`}
          </p>
        </div>
        <button
          className="min-h-10 rounded-full bg-gradient-to-r from-[#ff7fc0] to-[#ff813e] px-5 text-xs font-bold text-[#171717] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canJoin}
          onClick={() => onJoin(event)}
          type="button"
        >
          {isJoined ? "Joined" : participantCount >= capacity ? "Full" : "Join event"}
        </button>
      </div>
    </aside>
  );
}
