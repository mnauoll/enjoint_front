import { CalendarDays, MapPin, X } from "lucide-react";
import {
  getEventCapacity,
  getEventLocation,
  getEventParticipantCount,
  getEventPrice,
  getEventSchedule,
} from "./eventUtils";

export default function EventPreviewCard({
  event,
  isDark,
  participantCount: participantCountOverride,
  isJoined,
  onClose,
  onSeeMore,
  onJoin,
}) {
  const participantCount =
    participantCountOverride ?? getEventParticipantCount(event);
  const capacity = getEventCapacity(event);

  const handleSeeMore = () => {
    onClose();
    onSeeMore(event);
  };

  const handleJoin = () => {
    onClose();
    onJoin(event);
  };

  return (
    <article
      className={`w-[280px] rounded-2xl border p-4 font-sans shadow-2xl ${
        isDark
          ? "border-white/10 bg-[#11161d] text-white"
          : "border-gray-200 bg-white text-[#262626]"
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-[#ff65ac]">
          {event.category || event.type || "Event"}
        </p>
        <button
          aria-label="Close event preview"
          className="rounded-full p-1 text-current/60 transition hover:bg-black/5 hover:text-current dark:hover:bg-white/10"
          onClick={onClose}
          type="button"
        >
          <X size={15} />
        </button>
      </div>

      <h2 className="mb-3 text-base leading-tight font-bold">{event.title}</h2>

      <div className="space-y-1.5 text-[11px]">
        <p className="flex items-center gap-2">
          <CalendarDays className="shrink-0 text-[#ff65ac]" size={13} />
          <span>{getEventSchedule(event)}</span>
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="shrink-0 text-[#ff65ac]" size={13} />
          <span className="truncate">{getEventLocation(event)}</span>
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px]">
        <span className={isDark ? "text-white/60" : "text-gray-500"}>
          {participantCount} / {capacity} people · {Math.max(0, capacity - participantCount)} spots left
        </span>
        <span className="font-semibold">{getEventPrice(event)}</span>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          className={`h-9 flex-1 rounded-full text-xs font-semibold transition ${
            isDark
              ? "bg-[#202630] text-white hover:bg-[#2b3440]"
              : "bg-gray-100 text-[#262626] hover:bg-gray-200"
          }`}
          onClick={handleSeeMore}
          type="button"
        >
          See more
        </button>
        <button
          className="h-9 flex-1 rounded-full bg-gradient-to-r from-[#ff7fc0] to-[#ff813e] text-xs font-semibold text-[#171717] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isJoined || participantCount >= capacity}
          onClick={handleJoin}
          type="button"
        >
          {isJoined ? "Joined" : participantCount >= capacity ? "Full" : "Join"}
        </button>
      </div>
    </article>
  );
}
