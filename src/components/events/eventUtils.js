const WEEKDAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

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

export function isEventVisibleToGender(event, gender) {
  return !event.womenOnly || gender === "Woman";
}

export function getEventDate(event, referenceDate = new Date()) {
  const dateLabel = String(event.date || "").split("·")[0].trim().toLowerCase();
  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );
  const dottedDate = dateLabel.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dottedDate) {
    const [, day, month, year] = dottedDate;
    const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
    if (
      parsedDate.getFullYear() === Number(year) &&
      parsedDate.getMonth() === Number(month) - 1 &&
      parsedDate.getDate() === Number(day)
    ) {
      return parsedDate;
    }
    return null;
  }

  const isoDate = dateLabel.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDate) {
    const [, year, month, day] = isoDate;
    const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
    return parsedDate.getFullYear() === Number(year) &&
      parsedDate.getMonth() === Number(month) - 1 &&
      parsedDate.getDate() === Number(day)
      ? parsedDate
      : null;
  }

  if (dateLabel === "today") return today;
  if (dateLabel === "tomorrow") {
    today.setDate(today.getDate() + 1);
    return today;
  }

  const weekday = WEEKDAY_NAMES.indexOf(dateLabel);
  if (weekday < 0) return null;
  today.setDate(today.getDate() + ((weekday - today.getDay() + 7) % 7));
  return today;
}

export function getEventLocation(event) {
  return event.address || event.city || "Location to be announced";
}

export function getEventSchedule(event) {
  return [event.date, event.time].filter(Boolean).join(" · ") || "Date to be announced";
}
