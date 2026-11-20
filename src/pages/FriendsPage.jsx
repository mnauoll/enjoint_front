import { useMemo, useState } from "react";
import { Check, Copy, Search, UserPlus, Users, X } from "lucide-react";
import AppHeader from "../components/AppHeader";
import { CURRENT_USER_ID, DEMO_FRIENDS } from "../data/demoFriends";

function FriendAvatar({ friend }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br ${friend.avatarClass} text-xs font-bold text-white ring-2 ring-white dark:ring-[#11161d]`}
    >
      {friend.initials}
    </span>
  );
}

function SearchBox({ value, onChange, placeholder, id }) {
  return (
    <label
      className="flex h-11 items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 transition-colors focus-within:border-[#ff7fc0] dark:border-[#252d37] dark:bg-[#1b222c]"
      htmlFor={id}
    >
      <Search aria-hidden="true" className="size-4 shrink-0 text-gray-500 dark:text-white/50" />
      <input
        className="min-w-0 flex-1 bg-transparent text-xs text-[#262626] outline-none placeholder:text-gray-500 dark:text-white dark:placeholder:text-white/45"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
      {value && (
        <button
          aria-label="Clear search"
          className="text-gray-500 hover:text-[#262626] dark:text-white/50 dark:hover:text-white"
          onClick={() => onChange("")}
          type="button"
        >
          <X size={14} />
        </button>
      )}
    </label>
  );
}

function FriendRow({ friend, onChat, onInvite }) {
  return (
    <li className="flex min-w-0 items-center gap-3 border-b border-gray-200 py-3 last:border-b-0 dark:border-[#252d37] max-[560px]:flex-wrap">
      <FriendAvatar friend={friend} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{friend.name}</p>
        <p className="mt-1 truncate text-[10px] text-gray-500 dark:text-[#9ba3b0]">
          ID {friend.id}
        </p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          className="h-9 min-w-[78px] rounded-full bg-gradient-to-r from-[#ff7fc0] to-[#ff813e] px-4 text-xs font-semibold text-[#171219] transition hover:brightness-105"
          onClick={() => onChat(friend)}
          type="button"
        >
          Chat
        </button>
        <button
          className="h-9 rounded-full border border-gray-200 px-4 text-xs font-medium transition hover:border-[#ff7fc0] hover:text-[#ad316b] dark:border-[#303843] dark:hover:text-[#ff9acb]"
          onClick={() => onInvite(friend)}
          type="button"
        >
          Invite to event
        </button>
      </div>
    </li>
  );
}

function InviteDialog({ friend, events, isDark, onClose, onInvite }) {
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || "");

  const handleSubmit = (event) => {
    event.preventDefault();
    const selectedEvent = events.find(({ id }) => id === selectedEventId);
    if (selectedEvent) onInvite(friend, selectedEvent);
  };

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-labelledby="invite-dialog-title"
    >
      <form
        className={`w-full max-w-sm rounded-2xl border p-5 shadow-2xl ${
          isDark
            ? "border-white/10 bg-[#151a22] text-white"
            : "border-gray-200 bg-white text-[#262626]"
        }`}
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold" id="invite-dialog-title">
            Invite {friend.name}
          </h2>
          <button
            aria-label="Close invite dialog"
            className="rounded-full p-1 text-current/60 hover:bg-black/5 dark:hover:bg-white/10"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>
        {events.length > 0 ? (
          <>
            <label className="mt-5 block text-xs text-gray-500 dark:text-white/60" htmlFor="invite-event">
              Choose an event
            </label>
            <select
              className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 text-sm outline-none focus:border-[#ff7fc0] dark:border-[#303843] dark:bg-[#202630] dark:text-white"
              id="invite-event"
              onChange={(event) => setSelectedEventId(event.target.value)}
              value={selectedEventId}
            >
              {events.map((availableEvent) => (
                <option key={availableEvent.id} value={availableEvent.id}>
                  {availableEvent.title}
                </option>
              ))}
            </select>
            <button
              className="mt-5 h-10 w-full rounded-full bg-gradient-to-r from-[#ff7fc0] to-[#ff813e] text-sm font-semibold text-[#171219] transition hover:brightness-105"
              type="submit"
            >
              Send invitation
            </button>
          </>
        ) : (
          <p className="mt-5 rounded-xl bg-gray-100 p-3 text-sm text-gray-600 dark:bg-[#202630] dark:text-white/65">
            You can invite friends to events you created or have joined. You don't have any eligible events yet.
          </p>
        )}
      </form>
    </div>
  );
}

export default function FriendsPage({
  isDark,
  setIsDark,
  onTabChange,
  onOpenChat,
  events = [],
}) {
  const [activeSection, setActiveSection] = useState("friends");
  const [friendsSearch, setFriendsSearch] = useState("");
  const [peopleSearch, setPeopleSearch] = useState("");
  const [inviteFriend, setInviteFriend] = useState(null);
  const [notice, setNotice] = useState("");
  const [copyError, setCopyError] = useState("");

  const visibleFriends = useMemo(() => {
    const query = friendsSearch.trim().toLowerCase();
    return DEMO_FRIENDS.filter((friend) =>
      `${friend.name} ${friend.id}`.toLowerCase().includes(query),
    );
  }, [friendsSearch]);

  const foundPeople = useMemo(() => {
    const query = peopleSearch.trim().toLowerCase();
    if (!query) return [];
    return DEMO_FRIENDS.filter((friend) =>
      `${friend.name} ${friend.id}`.toLowerCase().includes(query),
    );
  }, [peopleSearch]);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(CURRENT_USER_ID);
      setCopyError("");
      setNotice("Your friend ID was copied.");
    } catch (error) {
      console.error("Unable to copy friend ID:", error);
      setCopyError("Could not copy the ID. Please select and copy it manually.");
      setNotice("");
    }
  };

  const handleChat = (friend) => {
    if (onOpenChat) onOpenChat(friend);
    else onTabChange("Chat");
  };

  const handleSendInvite = (friend, event) => {
    setInviteFriend(null);
    setNotice(`Invitation to “${event.title}” sent to ${friend.name}.`);
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] font-rubik text-[#262626] transition-colors dark:bg-[#1a212b] dark:text-white">
      <AppHeader
        activeTab="Friends"
        fixed
        isDark={isDark}
        onTabChange={onTabChange}
        onToggleTheme={() => setIsDark((current) => !current)}
      />

      <div className="mx-auto flex min-h-screen w-full max-w-[1180px] flex-col gap-3 px-5 pb-8 pt-[98px] max-[560px]:px-3">
        <div className="mb-1">
          <h1 className="text-2xl font-bold">Friends</h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-[#aeb5c0]">
            Find your people. Make plans together.
          </p>
        </div>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Friends sections">
          <button
            aria-selected={activeSection === "friends"}
            className={`flex h-9 items-center gap-1.5 rounded-full border px-4 text-xs font-medium transition ${
              activeSection === "friends"
                ? "border-[#e65a9c] bg-[#fce8f2] text-[#ad316b] dark:bg-[#2e2030] dark:text-[#ff87c2]"
                : "border-gray-300 text-[#262626] hover:border-[#e65a9c] dark:border-[#343c47] dark:text-white"
            }`}
            onClick={() => setActiveSection("friends")}
            role="tab"
            type="button"
          >
            <Check size={13} />
            Friends and requests
          </button>
          <button
            aria-selected={activeSection === "search"}
            className={`flex h-9 items-center gap-1.5 rounded-full border px-4 text-xs font-medium transition ${
              activeSection === "search"
                ? "border-[#e65a9c] bg-[#fce8f2] text-[#ad316b] dark:bg-[#2e2030] dark:text-[#ff87c2]"
                : "border-gray-300 text-[#262626] hover:border-[#e65a9c] dark:border-[#343c47] dark:text-white"
            }`}
            onClick={() => setActiveSection("search")}
            role="tab"
            type="button"
          >
            <UserPlus size={13} />
            Find by ID / people search
          </button>
        </div>

        <section
          aria-label={activeSection === "friends" ? "Your friends" : "Find people"}
          className="rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-[#29313b] dark:bg-[#11161d] max-[560px]:p-3.5"
        >
          {activeSection === "friends" ? (
            <>
              <div className="mb-4 flex items-center gap-2">
                <Users className="size-4 text-[#ff65ac]" />
                <h2 className="text-sm font-semibold">Your friends · {DEMO_FRIENDS.length}</h2>
              </div>
              <label className="mb-1.5 block text-[10px] text-gray-500 dark:text-[#9ba3b0]" htmlFor="friend-list-search">
                Search your friends
              </label>
              <SearchBox
                id="friend-list-search"
                onChange={setFriendsSearch}
                placeholder="Search by name or ID"
                value={friendsSearch}
              />
              <ul className="mt-3">
                {visibleFriends.map((friend) => (
                  <FriendRow
                    friend={friend}
                    key={friend.id}
                    onChat={handleChat}
                    onInvite={setInviteFriend}
                  />
                ))}
                {visibleFriends.length === 0 && (
                  <li className="py-6 text-center text-xs text-gray-500 dark:text-[#9ba3b0]">
                    No friends match your search.
                  </li>
                )}
              </ul>
            </>
          ) : (
            <>
              <h2 className="text-sm font-semibold">Find people</h2>
              <p className="mb-4 mt-1 text-[10px] text-gray-500 dark:text-[#9ba3b0]">
                Search using a name or permanent friend ID.
              </p>
              <SearchBox
                id="people-search"
                onChange={setPeopleSearch}
                placeholder="Enter a name or friend ID"
                value={peopleSearch}
              />
              <ul className="mt-3">
                {foundPeople.map((friend) => (
                  <FriendRow
                    friend={friend}
                    key={friend.id}
                    onChat={handleChat}
                    onInvite={setInviteFriend}
                  />
                ))}
                {peopleSearch.trim() && foundPeople.length === 0 && (
                  <li className="py-6 text-center text-xs text-gray-500 dark:text-[#9ba3b0]">
                    No matching people found in the demo data.
                  </li>
                )}
              </ul>
            </>
          )}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-[#29313b] dark:bg-[#11161d] max-[560px]:p-3.5">
          <h2 className="text-sm font-semibold">Your permanent friend ID</h2>
          <p className="mt-3 select-all font-mono text-lg font-bold tracking-wide">
            {CURRENT_USER_ID}
          </p>
          <p className="mt-2 text-[10px] text-gray-500 dark:text-[#9ba3b0]">
            Share this ID so friends can find you. You cannot change it.
          </p>
          <button
            className="mt-4 flex h-9 min-w-[120px] items-center justify-center gap-2 rounded-full border border-gray-200 text-xs font-semibold transition hover:border-[#ff7fc0] dark:border-[#303843]"
            onClick={handleCopyId}
            type="button"
          >
            <Copy size={13} />
            Copy ID
          </button>
          {(notice || copyError) && (
            <p
              aria-live="polite"
              className={`mt-3 text-xs ${copyError ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}
            >
              {copyError || notice}
            </p>
          )}
        </section>
      </div>

      {inviteFriend && (
        <InviteDialog
          events={events}
          friend={inviteFriend}
          isDark={isDark}
          onClose={() => setInviteFriend(null)}
          onInvite={handleSendInvite}
        />
      )}

    </main>
  );
}
