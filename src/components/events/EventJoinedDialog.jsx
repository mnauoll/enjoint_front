import { CheckCircle2, MessageCircle, X } from "lucide-react";
import { getEventParticipantCount } from "./eventUtils";

export default function EventJoinedDialog({ event, isDark, onClose }) {
  const participantCount = getEventParticipantCount(event, event.joinedCount);

  return (
    <div
      aria-labelledby="event-joined-title"
      aria-modal="true"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      role="dialog"
    >
      <section
        className={`relative w-full max-w-[390px] rounded-3xl border p-5 shadow-2xl ${
          isDark
            ? "border-white/10 bg-[#11161d] text-white"
            : "border-gray-200 bg-white text-[#262626]"
        }`}
      >
        <button
          aria-label="Close confirmation"
          className="absolute right-4 top-4 rounded-full p-1 text-current/60 transition hover:bg-black/5 dark:hover:bg-white/10"
          onClick={onClose}
          type="button"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-[#ff65ac]" size={22} />
          <h2 className="text-xl font-bold" id="event-joined-title">
            You’re in!
          </h2>
        </div>

        <h3 className="mt-4 pr-8 text-sm font-bold">{event.title}</h3>
        <p className={`mt-3 text-sm leading-relaxed ${isDark ? "text-white/65" : "text-gray-600"}`}>
          You’ve joined the event and have been added to this event’s group chat.
        </p>

        <div
          className={`mt-4 flex items-center gap-3 rounded-2xl p-3 ${
            isDark ? "bg-[#202630]" : "bg-gray-100"
          }`}
        >
          <MessageCircle className="shrink-0 text-[#ff65ac]" size={21} />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold">{event.title}</p>
            <p className={`mt-1 text-[11px] ${isDark ? "text-white/55" : "text-gray-500"}`}>
              {participantCount} participants, including you
            </p>
          </div>
        </div>

        <button
          className="mt-4 h-11 w-full rounded-full bg-gradient-to-r from-[#ff7fc0] to-[#ff813e] text-sm font-bold text-[#171717] transition hover:brightness-105 active:scale-[0.99]"
          type="button"
        >
          Open chat
        </button>
      </section>
    </div>
  );
}
