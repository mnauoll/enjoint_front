import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  MessageCircle,
  Pencil,
  Plus,
  Star,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import AppHeader from "../components/AppHeader";
import ExploreMap from "../components/ExploreMap";
import EventDateTimeFields from "../components/events/EventDateTimeFields";
import EventTypeSelect from "../components/events/EventTypeSelect";
import { POZNAN_CENTER } from "../data/demoEvents";
import { EVENT_TYPES } from "../data/eventTypes";
import {
  getEventCapacity,
  getEventLocation,
  getEventParticipantCount,
  getEventPrice,
  getEventSchedule,
} from "../components/events/eventUtils";
import { DEMO_EVENT_HISTORY } from "../data/demoEventHistory";

const TABS = [
  { id: "joined", label: "Joined" },
  { id: "created", label: "Created" },
  { id: "history", label: "History" },
];

function EventSummary({ event, isDark, history = false }) {
  const mutedText = isDark ? "text-[#aeb5c0]" : "text-gray-500";
  const participants = getEventParticipantCount(event);

  return (
    <div className={`min-w-0 flex-1 rounded-xl p-3 sm:p-4 ${isDark ? "bg-[#1b222c]" : "bg-gray-100"}`}>
      <p className="text-[10px] font-semibold text-[#ff65ac]">
        {event.category || event.type || "Event"}
      </p>
      <h3 className="mt-2 text-sm font-bold sm:text-base">{event.title}</h3>
      <div className={`mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] sm:text-xs ${mutedText}`}>
        <span className="flex items-center gap-1">
          <CalendarDays size={12} />
          {getEventSchedule(event)}
        </span>
        {event.duration && (
          <span className="flex items-center gap-1">
            <Clock3 size={12} />
            {event.duration}
          </span>
        )}
      </div>
      <p className={`mt-2 flex items-center gap-1 text-[10px] sm:text-xs ${mutedText}`}>
        <MapPin size={12} />
        {getEventLocation(event)}
      </p>
      <p className={`mt-2 text-[10px] sm:text-xs ${mutedText}`}>
        {participants} {history ? "attendees" : ` / ${getEventCapacity(event)} people`}
        {" · "}
        {getEventPrice(event)}
        {" · Hosted by "}
        {event.host || (event.createdByUser ? "Alex Morgan" : "Event host")}
      </p>
    </div>
  );
}

function Dialog({ title, children, isDark, onClose, labelledBy, variant = "default" }) {
  const isEdit = variant === "edit";
  return (
    <div
      aria-labelledby={labelledBy}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
    >
      <section
        className={`max-h-[90vh] w-full ${isEdit ? "max-w-2xl" : "max-w-lg"} overflow-y-auto rounded-2xl border p-5 shadow-2xl ${
          isEdit
            ? isDark
              ? "border-[#68465a] bg-[#2b2029] text-white"
              : "border-[#f0c6d8] bg-[#fff4f8] text-[#262626]"
            : isDark
              ? "border-[#29313b] bg-[#11161d] text-white"
              : "border-gray-200 bg-white text-[#262626]"
        }`}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold" id={labelledBy}>{title}</h2>
          <button
            aria-label="Close dialog"
            className="rounded-full p-1.5 opacity-70 transition hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function EventEditDialog({ event, isDark, onClose, onSave }) {
  const [values, setValues] = useState({
    title: event.title || "",
    description: event.description || "",
    date: event.date || "",
    time: event.time || "",
    address: event.address || "",
    category: event.category || event.type || "",
    people: event.people || String(event.maxParticipants || ""),
    price: event.price || "Free",
    comments: event.comments || "",
    lat: event.lat ?? POZNAN_CENTER[0],
    lng: event.lng ?? POZNAN_CENTER[1],
  });
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [locationError, setLocationError] = useState("");
  const inputClass = `w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[#ff7fc0] ${
    isDark ? "border-[#69495c] bg-[#382a35] text-white" : "border-[#efd3df] bg-white/80 text-[#262626]"
  }`;

  const update = (field, value) => setValues((current) => ({ ...current, [field]: value }));
  const handleLocationSelect = async ({ lat, lng }) => {
    setValues((current) => ({
      ...current,
      lat,
      lng,
      address: `Selected location (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
    }));
    setShowMapPicker(false);
    setIsResolvingAddress(true);
    setLocationError("");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      );
      if (!response.ok) throw new Error(`Address lookup failed with status ${response.status}`);
      const result = await response.json();
      const address = result.address || {};
      const street = [
        address.road || address.pedestrian || address.footway,
        address.house_number,
      ].filter(Boolean).join(" ");
      const city = address.city || address.town || address.village || address.municipality || address.suburb;
      const formattedAddress = [street, city].filter(Boolean).join(", ") || result.display_name;
      if (!formattedAddress) throw new Error("No address found for selected map point");
      update("address", formattedAddress);
    } catch (error) {
      console.error("Unable to resolve selected event location:", error);
      setLocationError("Location was selected, but its address could not be found. You can enter it below.");
    } finally {
      setIsResolvingAddress(false);
    }
  };

  return (
    <>
    <Dialog isDark={isDark} labelledBy="edit-event-title" onClose={onClose} title="Edit your event" variant="edit">
      <form
        className="grid gap-3 sm:grid-cols-2"
        onSubmit={(submitEvent) => {
          submitEvent.preventDefault();
          onSave({
            ...event,
            ...values,
            category: values.category,
            maxParticipants: Number.parseInt(values.people, 10) || event.maxParticipants,
          });
        }}
      >
        <label className="grid gap-1 text-xs font-medium">
          Event name
          <input
            className={inputClass}
            onChange={(changeEvent) => update("title", changeEvent.target.value)}
            required
            value={values.title}
          />
        </label>
        <div className="sm:col-span-2">
          <EventDateTimeFields
            date={values.date}
            isDark={isDark}
            onChange={update}
            time={values.time}
          />
        </div>
        <div className="grid gap-2 sm:col-span-2 sm:grid-cols-2">
          <div className="grid content-start gap-1 text-xs font-medium">
            <span>Meeting location</span>
            <div className={`flex min-h-11 items-center gap-2 rounded-xl border p-2 ${
              isDark ? "border-[#69495c] bg-[#382a35]" : "border-[#efd3df] bg-white/80"
            }`}>
              <span className="min-w-0 flex-1 truncate px-1 text-xs font-normal">
                {isResolvingAddress ? "Finding address…" : values.address || "Choose a location on the map"}
              </span>
              <button
                className="h-9 shrink-0 rounded-full border border-[#ec8ab5]/60 px-3 text-[10px] font-semibold text-[#ad316b] transition hover:bg-[#ff7fc0]/15 dark:text-[#ffabd0]"
                onClick={() => setShowMapPicker(true)}
                type="button"
              >
                Pick on map
              </button>
            </div>
            {locationError && <span className="text-[10px] text-red-500">{locationError}</span>}
          </div>
          <label className="grid gap-1 text-xs font-medium">
            Event type
            <EventTypeSelect
              id={`edit-event-type-${event.id}`}
              isDark={isDark}
              onChange={(value) => update("category", value)}
              options={EVENT_TYPES}
              value={values.category}
            />
          </label>
        </div>
        {[
          ["people", "Maximum people"],
          ["price", "Price"],
        ].map(([field, label]) => (
          <label className="grid gap-1 text-xs font-medium" key={field}>
            {label}
            <input
              className={inputClass}
              onChange={(changeEvent) => update(field, changeEvent.target.value)}
              min={field === "people" ? "1" : undefined}
              type={field === "people" ? "number" : "text"}
              value={values[field]}
            />
          </label>
        ))}
        <label className="grid gap-1 text-xs font-medium sm:col-span-2">
          Description
          <textarea
            className={`${inputClass} min-h-20 resize-y`}
            onChange={(changeEvent) => update("description", changeEvent.target.value)}
            value={values.description}
          />
        </label>
        <label className="grid gap-1 text-xs font-medium sm:col-span-2">
          Additional comments
          <textarea
            className={`${inputClass} min-h-16 resize-y`}
            onChange={(changeEvent) => update("comments", changeEvent.target.value)}
            value={values.comments}
          />
        </label>
        <div className="flex justify-end gap-2 pt-2 sm:col-span-2">
          <button className="h-10 rounded-full border border-current/15 px-5 text-xs font-semibold" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="h-10 rounded-full bg-gradient-to-r from-[#ff7fc0] to-[#ff813e] px-5 text-xs font-bold text-[#171219]" type="submit">
            Save changes
          </button>
        </div>
      </form>
    </Dialog>
    {showMapPicker && (
      <Dialog
        isDark={isDark}
        labelledBy="edit-event-location-title"
        onClose={() => setShowMapPicker(false)}
        title="Pick event location"
      >
        <div className="h-[min(55vh,420px)] min-h-64 overflow-hidden rounded-xl border border-[#ec8ab5]/30">
          <ExploreMap
            center={[values.lat, values.lng]}
            events={[]}
            isDark={isDark}
            onLocationSelect={handleLocationSelect}
            selectedLocation={[values.lat, values.lng]}
            selectionMode
          />
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-white/60">Click the map to set the event location.</p>
      </Dialog>
    )}
    </>
  );
}

function ConfirmDialog({ event, isDark, action, onClose, onConfirm }) {
  const isDelete = action === "delete";
  const title = isDelete ? "Delete event and group chat?" : "Leave this event?";

  return (
    <Dialog isDark={isDark} labelledBy="confirm-event-title" onClose={onClose} title={title}>
      <p className={`text-sm ${isDark ? "text-white/65" : "text-gray-600"}`}>
        {isDelete
          ? `${event.title} will be removed from the map and My Events. This action cannot be undone.`
          : `You will no longer be on the participant list for ${event.title}.`}
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <button className="h-10 rounded-full border border-current/15 px-5 text-xs font-semibold" onClick={onClose} type="button">
          Cancel
        </button>
        <button
          className={`h-10 rounded-full px-5 text-xs font-bold text-white ${isDelete ? "bg-[#c92d4b]" : "bg-[#303843]"}`}
          onClick={onConfirm}
          type="button"
        >
          {isDelete ? "Delete event and chat" : "Leave event"}
        </button>
      </div>
    </Dialog>
  );
}

function EventDetailsDialog({ event, isDark, onClose }) {
  const mutedText = isDark ? "text-[#aeb5c0]" : "text-gray-500";
  return (
    <Dialog isDark={isDark} labelledBy="event-details-title" onClose={onClose} title="Event details">
      <EventSummary event={event} isDark={isDark} />
      {event.description && <p className={`mt-4 text-sm leading-relaxed ${mutedText}`}>{event.description}</p>}
      {event.comments && (
        <p className={`mt-4 border-t border-current/10 pt-4 text-sm ${mutedText}`}>
          <span className="font-semibold text-current">Additional comments: </span>
          {event.comments}
        </p>
      )}
    </Dialog>
  );
}

function EventCard({ event, isDark, kind, onAction }) {
  const [showRatings, setShowRatings] = useState(false);
  const [ratings, setRatings] = useState({});
  const people = event.participants || [event.host || "Event host"];
  const mutedText = isDark ? "text-[#aeb5c0]" : "text-gray-500";
  const cardClass = `rounded-2xl border p-3.5 sm:p-4 ${isDark ? "border-[#29313b] bg-[#11161d]" : "border-gray-200 bg-white"}`;
  const buttonClass = "flex h-10 items-center justify-center gap-1.5 rounded-full border border-current/15 px-4 text-[11px] font-semibold transition hover:border-[#ff7fc0] sm:px-5";
  const primaryButtonClass = "flex h-10 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#ff7fc0] to-[#ff813e] px-4 text-[11px] font-bold text-[#171219] transition hover:brightness-105 sm:px-5";

  return (
    <article className={cardClass}>
      <div className="flex flex-col gap-3 sm:flex-row">
        {event.image && (
          <img alt="" className="h-36 w-full rounded-xl object-cover sm:h-auto sm:w-56" src={event.image} />
        )}
        <EventSummary event={event} isDark={isDark} history={kind === "history"} />
      </div>
      <p className={`mt-3 flex items-center gap-1.5 text-[11px] ${kind === "history" ? "text-emerald-500" : "text-emerald-500"}`}>
        <Check size={13} />
        {kind === "history" ? "Completed · You attended" : kind === "joined" ? "You're going · Your place is confirmed" : "Created by you · Upcoming event"}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {kind === "joined" && (
          <>
            <button className={buttonClass} onClick={() => onAction("details", event)} type="button">View details</button>
            <button className={primaryButtonClass} onClick={() => onAction("chat", event)} type="button">
              <MessageCircle size={14} /> Open chat
            </button>
            <button className={buttonClass} onClick={() => onAction("leave", event)} type="button">Leave event</button>
          </>
        )}
        {kind === "created" && (
          <>
            <button className={primaryButtonClass} onClick={() => onAction("edit", event)} type="button">
              <Pencil size={14} /> Edit event
            </button>
            <button className={buttonClass} onClick={() => onAction("chat", event)} type="button">
              <MessageCircle size={14} /> Open chat
            </button>
            <button className={buttonClass} onClick={() => onAction("invite", event)} type="button">
              <UserPlus size={14} /> Invite friends
            </button>
            <button className={buttonClass} onClick={() => onAction("delete", event)} type="button">
              <Trash2 size={14} /> Delete event
            </button>
          </>
        )}
        {kind === "history" && (
          <>
            <button className={buttonClass} onClick={() => onAction("details", event)} type="button">View event</button>
            <button className={primaryButtonClass} onClick={() => setShowRatings((current) => !current)} type="button">
              <Star size={14} /> {showRatings ? "Hide ratings" : "Rate participants"}
            </button>
          </>
        )}
      </div>
      {kind === "history" && showRatings && (
        <section className={`mt-4 border-t border-current/10 pt-4 ${mutedText}`}>
          <h3 className="text-sm font-bold text-current">People you met</h3>
          <p className="mt-1 text-xs">Rate participants from this completed event.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {people.map((person) => (
              <div className={`rounded-xl p-3 ${isDark ? "bg-[#1b222c]" : "bg-gray-100"}`} key={person}>
                <div className="flex size-8 items-center justify-center rounded-full bg-[#3a2938] text-[10px] font-bold text-[#ff9acb]">
                  {person.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                </div>
                <p className="mt-2 text-xs font-semibold text-current">{person}</p>
                <p className="mt-1 text-[10px]">Shared completed event · {ratings[person] ? `Rated ${ratings[person]}/5` : "Not rated yet"}</p>
                <div aria-label={`Rate ${person}`} className="mt-2 flex gap-1" role="group">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      aria-label={`${rating} stars`}
                      aria-pressed={ratings[person] === rating}
                      className={ratings[person] >= rating ? "text-amber-400" : "text-current/35"}
                      key={rating}
                      onClick={() => setRatings((current) => ({ ...current, [person]: rating }))}
                      type="button"
                    >
                      <Star fill={ratings[person] >= rating ? "currentColor" : "none"} size={15} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

export default function MyEventsPage({
  events = [],
  joinedEventIds = new Set(),
  isDark,
  setIsDark,
  onTabChange,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  onLeaveEvent,
  onOpenChat,
}) {
  const [activeSection, setActiveSection] = useState("joined");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [notice, setNotice] = useState("");

  const eventGroups = useMemo(() => {
    const joined = events.filter((event) => joinedEventIds.has(event.id) && !event.createdByUser);
    const created = events.filter((event) => event.createdByUser);
    return { joined, created, history: DEMO_EVENT_HISTORY };
  }, [events, joinedEventIds]);

  const currentEvents = eventGroups[activeSection];
  const heading = activeSection === "created"
    ? `Created by you · ${currentEvents.length} ${currentEvents.length === 1 ? "upcoming event" : "upcoming events"}`
    : activeSection === "history"
      ? "October 2026 · Past events"
      : `Upcoming · ${currentEvents.length} ${currentEvents.length === 1 ? "event" : "events"}`;

  const handleAction = (action, event) => {
    setNotice("");
    if (action === "details") setSelectedEvent(event);
    else if (action === "edit" || action === "delete" || action === "leave") setDialog({ action, event });
    else if (action === "chat") onOpenChat(event);
    else if (action === "invite") onTabChange("Friends");
  };

  const handleConfirm = () => {
    if (dialog.action === "delete") {
      onDeleteEvent(dialog.event.id);
      setNotice(`“${dialog.event.title}” was deleted.`);
    } else {
      onLeaveEvent(dialog.event.id);
      setNotice(`You left “${dialog.event.title}”.`);
    }
    setDialog(null);
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] font-rubik text-[#262626] transition-colors dark:bg-[#0b0f14] dark:text-white">
      <AppHeader activeTab="My Events" fixed isDark={isDark} onTabChange={onTabChange} />
      <div className="mx-auto flex min-h-screen w-full max-w-[1180px] flex-col gap-4 px-5 pb-10 pt-[98px] max-[560px]:px-3">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">My Events</h1>
            <p className={`mt-1 text-xs ${isDark ? "text-[#aeb5c0]" : "text-gray-500"}`}>
              {activeSection === "created"
                ? "Manage the events you host and keep everyone in the loop."
                : activeSection === "history"
                  ? "Good company, remembered. Your completed events live here."
                  : "Your next plans and the people you meet along the way."}
            </p>
          </div>
          <button
            className="flex h-10 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#ff7fc0] to-[#ff813e] px-5 text-xs font-bold text-[#171219] transition hover:brightness-105"
            onClick={onCreateEvent}
            type="button"
          >
            <Plus size={14} /> Create event
          </button>
        </header>

        <div aria-label="My event categories" className="flex flex-wrap gap-2" role="tablist">
          {TABS.map((tab) => (
            <button
              aria-selected={activeSection === tab.id}
              className={`flex h-9 items-center gap-1.5 rounded-full border px-4 text-xs font-medium transition ${
                activeSection === tab.id
                  ? "border-[#e65a9c] bg-[#fce8f2] text-[#ad316b] dark:bg-[#2e2030] dark:text-[#ff87c2]"
                  : "border-gray-300 hover:border-[#e65a9c] dark:border-[#343c47]"
              }`}
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              role="tab"
              type="button"
            >
              {activeSection === tab.id && <Check size={13} />}
              {tab.label}
            </button>
          ))}
        </div>

        <section aria-label={`${TABS.find((tab) => tab.id === activeSection)?.label} events`} className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">{heading}</h2>
          {notice && <p aria-live="polite" className="text-xs text-emerald-600 dark:text-emerald-400">{notice}</p>}
          {currentEvents.length ? (
            currentEvents.map((event) => (
              <EventCard
                event={event}
                isDark={isDark}
                key={event.id}
                kind={activeSection}
                onAction={handleAction}
              />
            ))
          ) : (
            <div className={`rounded-2xl border p-8 text-center ${isDark ? "border-[#29313b] bg-[#11161d]" : "border-gray-200 bg-white"}`}>
              <Users className="mx-auto text-[#ff65ac]" size={24} />
              <h3 className="mt-3 text-sm font-semibold">
                {activeSection === "created" ? "You haven't created any events yet" : "No joined events yet"}
              </h3>
              <p className={`mt-1 text-xs ${isDark ? "text-[#aeb5c0]" : "text-gray-500"}`}>
                Explore the map to find a plan that sounds good.
              </p>
              <button
                className="mt-4 h-9 rounded-full bg-gradient-to-r from-[#ff7fc0] to-[#ff813e] px-5 text-xs font-bold text-[#171219]"
                onClick={() => onTabChange("Explore Map")}
                type="button"
              >
                Explore events
              </button>
            </div>
          )}
        </section>

        {activeSection === "history" && (
          <p className={`text-[10px] ${isDark ? "text-[#aeb5c0]" : "text-gray-500"}`}>
            Upcoming plans are in Joined and Created. You can rate people after an event you both attended has ended.
          </p>
        )}
      </div>

      <button
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        className="fixed bottom-5 right-5 z-30 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold shadow-lg transition hover:-translate-y-0.5 dark:border-[#303843] dark:bg-[#11161d]"
        onClick={() => setIsDark((current) => !current)}
        type="button"
      >
        {isDark ? "Light theme" : "Dark theme"}
      </button>

      {selectedEvent && (
        <EventDetailsDialog event={selectedEvent} isDark={isDark} onClose={() => setSelectedEvent(null)} />
      )}
      {dialog?.action === "edit" && (
        <EventEditDialog
          event={dialog.event}
          isDark={isDark}
          onClose={() => setDialog(null)}
          onSave={(updatedEvent) => {
            onUpdateEvent(updatedEvent);
            setNotice(`“${updatedEvent.title}” was updated.`);
            setDialog(null);
          }}
        />
      )}
      {(dialog?.action === "delete" || dialog?.action === "leave") && (
        <ConfirmDialog
          action={dialog.action}
          event={dialog.event}
          isDark={isDark}
          onClose={() => setDialog(null)}
          onConfirm={handleConfirm}
        />
      )}
    </main>
  );
}
