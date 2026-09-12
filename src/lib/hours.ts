import { DEALER } from "./dealer.ts";

export type Department = "sales" | "service" | "parts";

const TZ = "America/Chicago";
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export interface OpenStatus {
  department: Department;
  open: boolean;
  label: string;
  todayHours: string;
}

function chicagoParts(now: Date) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = fmt.formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Monday";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return { weekday, minutes: hour * 60 + minute };
}

function parseMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function departmentStatus(department: Department, now = new Date()): OpenStatus {
  const { weekday, minutes } = chicagoParts(now);
  const row = DEALER.hours[department].find((item) => item.day === weekday);
  if (!row?.opens || !row.closes) {
    return { department, open: false, label: "Closed now", todayHours: "Closed" };
  }
  const opens = parseMinutes(row.opens);
  const closes = parseMinutes(row.closes);
  const open = minutes >= opens && minutes < closes;
  return {
    department,
    open,
    label: open ? "Open now" : "Closed now",
    todayHours: `${row.opens}–${row.closes} CT`,
  };
}

export function allDepartmentStatus(now = new Date()): OpenStatus[] {
  return (["sales", "service", "parts"] as const).map((dept) => departmentStatus(dept, now));
}

export function chicagoWeekday(now = new Date()): (typeof DAYS)[number] {
  const { weekday } = chicagoParts(now);
  return (DAYS.find((d) => d === weekday) ?? "Monday") as (typeof DAYS)[number];
}
