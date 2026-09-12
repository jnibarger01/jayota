import type { Grade, Vehicle } from "../showroom/types/vehicle.ts";

export interface TrimChange {
  gradeId: string;
  added: string[];
  removed: string[];
  priceDelta: number;
}

export function trimMatrix(vehicle: Vehicle): {
  grades: Grade[];
  featureUniverse: string[];
  present: Record<string, Set<string>>;
} {
  const grades = vehicle.grades;
  const featureUniverse = [...new Set(grades.flatMap((g) => g.standardFeatures))];
  const present: Record<string, Set<string>> = {};
  for (const grade of grades) present[grade.id] = new Set(grade.standardFeatures);
  return { grades, featureUniverse, present };
}

export function whatChanges(vehicle: Vehicle, fromId: string, toId: string): TrimChange | null {
  const from = vehicle.grades.find((g) => g.id === fromId);
  const to = vehicle.grades.find((g) => g.id === toId);
  if (!from || !to) return null;
  const fromSet = new Set(from.standardFeatures);
  const toSet = new Set(to.standardFeatures);
  return {
    gradeId: to.id,
    added: to.standardFeatures.filter((f) => !fromSet.has(f)),
    removed: from.standardFeatures.filter((f) => !toSet.has(f)),
    priceDelta: to.msrp - from.msrp,
  };
}
