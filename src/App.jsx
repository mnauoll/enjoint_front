import { useEffect, useState } from "react";
import Chat from "./pages/Chat";
import ExplorePage from "./pages/ExplorePage";
import FriendsPage from "./pages/FriendsPage";
import MyEventsPage from "./pages/MyEventsPage";
import SettingsPage from "./pages/SettingsPage";
import { getEventParticipantCount } from "./components/events/eventUtils";
import { DEMO_EVENTS } from "./data/demoEvents";

function App() {
  const [activeTab, setActiveTab] = useState("Explore Map");
  const [events, setEvents] = useState(DEMO_EVENTS);
  const [joinedEventIds, setJoinedEventIds] = useState(() => new Set());
  const [shouldOpenCreateEvent, setShouldOpenCreateEvent] = useState(false);
  const [chatRequest, setChatRequest] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    try {
      return window.localStorage.getItem("theme") !== "light";
    } catch (error) {
      console.error("Unable to load saved theme:", error);
      return true;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    try {
      window.localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch (error) {
      console.error("Unable to save selected theme:", error);
    }
  }, [isDark]);

  const handleCreatedEvent = (event) => {
    setEvents((currentEvents) => [
      ...currentEvents,
      { ...event, createdByUser: true },
    ]);
  };

  const handleJoinEvent = (event) => {
    setJoinedEventIds((currentIds) => {
      if (currentIds.has(event.id)) return currentIds;
      return new Set(currentIds).add(event.id);
    });

    setEvents((currentEvents) =>
      currentEvents.map((currentEvent) => {
        if (currentEvent.id !== event.id) return currentEvent;
        if (joinedEventIds.has(event.id)) return currentEvent;

        const participants = currentEvent.participants || [];
        return {
          ...currentEvent,
          attendeesCount: getEventParticipantCount(currentEvent) + 1,
          participants: [...participants, "Alex Morgan"],
        };
      }),
    );
  };

  const handleLeaveEvent = (eventId) => {
    setJoinedEventIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.delete(eventId);
      return nextIds;
    });
    setEvents((currentEvents) =>
      currentEvents.map((event) => {
        if (event.id !== eventId) return event;
        const participants = event.participants || [];
        return {
          ...event,
          attendeesCount: Math.max(0, getEventParticipantCount(event) - 1),
          participants: participants.filter((participant) => participant !== "Alex Morgan"),
        };
      }),
    );
  };

  const handleDeleteEvent = (eventId) => {
    setEvents((currentEvents) => currentEvents.filter((event) => event.id !== eventId));
    setJoinedEventIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.delete(eventId);
      return nextIds;
    });
  };

  const handleCreateFromMyEvents = () => {
    setShouldOpenCreateEvent(true);
    setActiveTab("Explore Map");
  };

  const handleCreateEventRequestHandled = () => setShouldOpenCreateEvent(false);

  const handleOpenEventChat = (event) => {
    const host = event.host || "Alex Morgan";
    const initials = event.title
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    setChatRequest({
      id: `event-${event.id}`,
      kind: "group",
      title: event.title,
      initials,
      subtitle: `${getEventParticipantCount(event, event.joinedCount)} participants · Hosted by ${host}`,
      eventDate: [event.date, event.time].filter(Boolean).join(" · ") || "Date to be announced",
      eventPlace: event.address || event.city || "Location to be announced",
      notice: `Group chat for ${event.title}`,
      preview: "Start a conversation",
      previewTime: "Now",
      messages: [],
    });
    setActiveTab("Chat");
  };

  const handleOpenFriendChat = (friend) => {
    setChatRequest({
      id: `friend-${friend.id}`,
      kind: "private",
      title: friend.name,
      initials: friend.initials || friend.name.split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase(),
      subtitle: "Friend",
      preview: "Start a conversation",
      previewTime: "Now",
      messages: [],
    });
    setActiveTab("Chat");
  };

  const inviteableEvents = events.filter(
    (event) => event.createdByUser || joinedEventIds.has(event.id),
  );

  return (
    <>
      {activeTab === "Friends" ? (
        <FriendsPage
          isDark={isDark}
          setIsDark={setIsDark}
          onTabChange={setActiveTab}
          events={inviteableEvents}
          onOpenChat={handleOpenFriendChat}
        />
      ) : activeTab === "My Events" ? (
        <MyEventsPage
          events={events}
          joinedEventIds={joinedEventIds}
          isDark={isDark}
          setIsDark={setIsDark}
          onTabChange={setActiveTab}
          onCreateEvent={handleCreateFromMyEvents}
          onUpdateEvent={(updatedEvent) =>
            setEvents((currentEvents) =>
              currentEvents.map((event) => event.id === updatedEvent.id ? updatedEvent : event),
            )
          }
          onDeleteEvent={handleDeleteEvent}
          onLeaveEvent={handleLeaveEvent}
          onOpenChat={handleOpenEventChat}
        />
      ) : activeTab === "Settings" ? (
        <SettingsPage
          isDark={isDark}
          setIsDark={setIsDark}
          onTabChange={setActiveTab}
        />
      ) : activeTab === "Chat" ? (
        <Chat
          isDark={isDark}
          setIsDark={setIsDark}
          onTabChange={setActiveTab}
          chatRequest={chatRequest}
          onChatRequestHandled={() => setChatRequest(null)}
        />
      ) : (
        <ExplorePage
          activeTab={activeTab}
          events={events}
          joinedEventIds={joinedEventIds}
          onCreatedEvent={handleCreatedEvent}
          onJoinEvent={handleJoinEvent}
          onOpenChat={handleOpenEventChat}
          shouldOpenCreateEvent={shouldOpenCreateEvent}
          onCreateEventRequestHandled={handleCreateEventRequestHandled}
          isDark={isDark}
          onTabChange={setActiveTab}
          setIsDark={setIsDark}
        />
      )}
    </>
  );
}

export default App;