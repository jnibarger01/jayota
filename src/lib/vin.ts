/** VIN decode helpers. Never invents a trade value. */

const YEAR_CODES: Record<string, number> = {
  A: 2010, B: 2011, C: 2012, D: 2013, E: 2014, F: 2015, G: 2016, H: 2017, J: 2018, K: 2019,
  L: 2020, M: 2021, N: 2022, P: 2023, R: 2024, S: 2025, T: 2026, V: 2027,
};

const WMI: Record<string, string> = {
  "1NX": "Toyota (USA)",
  "2T1": "Toyota (Canada)",
  "4T1": "Toyota (USA)",
  "4T3": "Toyota (USA)",
  "5TD": "Toyota (USA)",
  "5TF": "Toyota (USA)",
  "5TE": "Toyota (USA)",
  "7MU": "Toyota (USA)",
  JTD: "Toyota (Japan)",
  JT2: "Toyota (Japan)",
  JT3: "Toyota (Japan)",
  JT4: "Toyota (Japan)",
  JT8: "Lexus (Japan)",
  JTE: "Toyota (Japan)",
  JTN: "Toyota (Japan)",
  "5YJ": "Tesla — not a Toyota VIN",
};

export interface LocalVinDecode {
  vin: string;
  valid: boolean;
  wmi: string;
  manufacturer: string | null;
  modelYear: number | null;
  note: string;
}

export function normalizeVin(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");
}

export function decodeVinLocal(raw: string): LocalVinDecode {
  const vin = normalizeVin(raw);
  if (vin.length !== 17) {
    return {
      vin,
      valid: false,
      wmi: vin.slice(0, 3),
      manufacturer: null,
      modelYear: null,
      note: "A VIN is 17 characters. This is a format check only — not a valuation.",
    };
  }
  const wmi = vin.slice(0, 3);
  const year = YEAR_CODES[vin[9] ?? ""] ?? null;
  const manufacturer = WMI[wmi] ?? null;
  return {
    vin,
    valid: true,
    wmi,
    manufacturer,
    modelYear: year,
    note: manufacturer
      ? "Decoded from the VIN itself. This is not a trade-in offer or NADA/KBB value."
      : "VIN format is valid. Manufacturer WMI is not in this local table — request an appraisal at the dealership.",
  };
}
