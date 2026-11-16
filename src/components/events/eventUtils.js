export function getEventCapacity(event) {
  if (Number.isFinite(Number(event.maxParticipants))) {
    return Number(event.maxParticipants);
  }

  const peopleCount = Number.parseInt(event.people, 10);
  return Number.isNaN(peopleCount) ? 12 : peopleCount;
}

export function getEventParticipantCount(event, joinedCount) {
  if (joinedCount !== undefined) return joinedCount;
  if (Number.isFinite(Number(event.attendeesCount))) {
    return Number(event.attendeesCount);
  }
  return event.participants?.length || 1;
}

export function getEventPrice(event) {
  const price = String(event.price || "Free").trim();
  return price.toLowerCase() === "free" || price === "0" ? "Free" : price;
}

export function getEventLocation(event) {
  return event.address || event.city || "Location to be announced";
}

export function getEventSchedule(event) {
  return [event.date, event.time].filter(Boolean).join(" · ") || "Date to be announced";
}
