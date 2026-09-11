/**
 * Dealership identity — only facts verified from public Toyota / Hendrick sources.
 *
 * Address + general phone: Toyota.com dealer directory for Hendrick Toyota Merriam
 * (https://www.toyota.com/dealers/kansas/merriam/66203/hendrick-toyota-merriam/, observed 2026-09-03).
 * Hours: same Toyota.com directory snapshot. Hours change on holidays; always confirm
 * with the dealer. Official site: https://www.hendricktoyotamerriam.com
 *
 * No employee names, inventory counts, offers, or service prices are recorded here.
 */
export const DEALER = {
  name: "Hendrick Toyota Merriam",
  legalName: "Hendrick Toyota Merriam",
  group: "Hendrick Automotive Group",
  address: {
    street: "9505 W. 67th Street",
    city: "Merriam",
    state: "KS",
    zip: "66203",
    country: "US",
  },
  geo: {
    // Approximate map pin for 9505 W 67th St, Merriam, KS — not a surveyed coordinate.
    lat: 39.0056,
    lng: -94.6925,
    precision: "approximate" as const,
  },
  phone: {
    general: "(913) 831-0800",
    generalTel: "+19138310800",
  },
  website: "https://www.hendricktoyotamerriam.com",
  toyotaDealerDirectory:
    "https://www.toyota.com/dealers/kansas/merriam/66203/hendrick-toyota-merriam/",
  mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=9505+W+67th+Street+Merriam+KS+66203",
  osmEmbed:
    "https://www.openstreetmap.org/export/embed.html?bbox=-94.7025%2C38.9956%2C-94.6825%2C39.0156&layer=mapnik&marker=39.0056%2C-94.6925",
  hoursSource: "Toyota.com dealer directory, observed 2026-09-03. Confirm before visiting.",
  hours: {
    sales: [
      { day: "Sunday", opens: "12:00", closes: "18:00" },
      { day: "Monday", opens: "09:00", closes: "20:00" },
      { day: "Tuesday", opens: "09:00", closes: "20:00" },
      { day: "Wednesday", opens: "09:00", closes: "20:00" },
      { day: "Thursday", opens: "09:00", closes: "20:00" },
      { day: "Friday", opens: "09:00", closes: "20:00" },
      { day: "Saturday", opens: "09:00", closes: "19:00" },
    ],
    service: [
      { day: "Sunday", opens: null, closes: null },
      { day: "Monday", opens: "07:00", closes: "18:00" },
      { day: "Tuesday", opens: "07:00", closes: "18:00" },
      { day: "Wednesday", opens: "07:00", closes: "18:00" },
      { day: "Thursday", opens: "07:00", closes: "18:00" },
      { day: "Friday", opens: "07:00", closes: "18:00" },
      { day: "Saturday", opens: "07:00", closes: "18:00" },
    ],
    parts: [
      { day: "Sunday", opens: null, closes: null },
      { day: "Monday", opens: "08:00", closes: "18:00" },
      { day: "Tuesday", opens: "08:00", closes: "18:00" },
      { day: "Wednesday", opens: "08:00", closes: "18:00" },
      { day: "Thursday", opens: "08:00", closes: "18:00" },
      { day: "Friday", opens: "08:00", closes: "18:00" },
      { day: "Saturday", opens: "09:00", closes: "18:00" },
    ],
  },
} as const;

export const CATALOG_DISCLAIMER =
  "Prices, MPG, horsepower, and equipment shown are representative catalog figures from this project’s vehicle database. They are not live Toyota.com quotes, not advertised selling prices, and not a commitment from Hendrick Toyota Merriam. Confirm current MSRP, availability, and incentives with the dealership.";

export const FINANCE_DISCLAIMER =
  "Payment estimates are mathematical illustrations using the numbers you enter. They are not an offer of credit, not a guaranteed payment, and not a Toyota or dealer finance rate. Actual terms depend on credit approval, lender, taxes, fees, and incentives. Hendrick Toyota Merriam will provide a real quote on request.";

export const INVENTORY_UNAVAILABLE =
  "Live new- and used-vehicle inventory is not connected. This site does not display fabricated stock, VINs, or dealer prices. Call Hendrick Toyota Merriam or visit the official dealer website to check what is on the lot.";

export const OFFERS_UNAVAILABLE =
  "Current Toyota and dealer offers are not connected to a live incentives feed. This site will not display expired, guessed, or invented APR, lease, or rebate figures. Ask the dealership for current programs that apply to you.";

export function formatHour(opens: string | null, closes: string | null): string {
  if (!opens || !closes) return "Closed";
  return `${to12(opens)} – ${to12(closes)}`;
}

function to12(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hr} ${ampm}` : `${hr}:${mStr} ${ampm}`;
}

export function formatAddress(): string {
  const a = DEALER.address;
  return `${a.street}, ${a.city}, ${a.state} ${a.zip}`;
}
