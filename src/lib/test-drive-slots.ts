import { DEALER } from "./dealer.ts";

export interface DriveSlot {
  iso: string;
  label: string;
  window: "morning" | "afternoon" | "evening";
}

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function windowFor(hour: number): DriveSlot["window"] {
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

/** Proposed slots from published sales hours — a request, not a confirmed appointment. */
export function upcomingSalesSlots(days = 14, now = new Date()): DriveSlot[] {
  const slots: DriveSlot[] = [];
  for (let offset = 1; offset <= days; offset += 1) {
    const day = new Date(now);
    day.setDate(now.getDate() + offset);
    const name = day.toLocaleDateString("en-US", { weekday: "long" });
    const row = DEALER.hours.sales.find((item) => item.day === name);
    if (!row?.opens || !row.closes) continue;
    const openH = Number(row.opens.slice(0, 2));
    const closeH = Number(row.closes.slice(0, 2));
    for (let hour = openH; hour < closeH; hour += 1) {
      if (hour < 9) continue;
      const labelDate = day.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      const ampm = hour >= 12 ? "PM" : "AM";
      const hr = hour % 12 === 0 ? 12 : hour % 12;
      slots.push({
        iso: `${toIsoDate(day)}T${String(hour).padStart(2, "0")}:00`,
        label: `${labelDate} · ${hr}:00 ${ampm} CT`,
        window: windowFor(hour),
      });
    }
  }
  return slots;
}
