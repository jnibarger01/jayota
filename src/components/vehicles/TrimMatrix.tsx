import { useState } from "react";
import type { Vehicle } from "@/showroom/types/vehicle";
import { trimMatrix, whatChanges } from "@/lib/trim-diff";
import { formatUsd } from "@/lib/utils";
import { getCatalogFacts } from "@/lib/catalog-facts";

export function TrimMatrix({ vehicle }: { vehicle: Vehicle }) {
  const { grades, featureUniverse, present } = trimMatrix(vehicle);
  const [fromId, setFromId] = useState(grades[0]?.id ?? "");
  const [toId, setToId] = useState(grades[1]?.id ?? grades[0]?.id ?? "");
  const change = whatChanges(vehicle, fromId, toId);
  const facts = getCatalogFacts(vehicle.slug);

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold">Trim & package visualizer</h2>
      <p className="mt-2 text-sm text-muted">
        Features below are only the standard-feature strings in this project catalog. Empty cells mean the
        catalog does not list that feature on that trim — not that Toyota omitted it in the real world.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="p-3 text-muted"> </th>
              {grades.map((grade) => (
                <th key={grade.id} className="p-3">
                  {grade.name}
                  <span className="mt-1 block text-xs font-normal text-muted">{formatUsd(grade.msrp)}*</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <th className="p-3 text-muted">Powertrain id</th>
              {grades.map((grade) => (
                <td key={grade.id} className="p-3">
                  {vehicle.powertrains[grade.powertrainId]?.type ?? grade.powertrainId}
                </td>
              ))}
            </tr>
            <tr className="border-b border-border">
              <th className="p-3 text-muted">Drivetrain</th>
              {grades.map((grade) => (
                <td key={grade.id} className="p-3 uppercase">
                  {vehicle.powertrains[grade.powertrainId]?.drivetrain ?? "—"}
                </td>
              ))}
            </tr>
            {featureUniverse.map((feature) => (
              <tr key={feature} className="border-b border-border">
                <th className="p-3 text-muted">{feature}</th>
                {grades.map((grade) => (
                  <td key={grade.id} className="p-3">
                    {present[grade.id]?.has(feature) ? "Yes" : "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {grades.length >= 2 ? (
        <div className="mt-6 rounded-2xl border border-border bg-surface p-4">
          <p className="text-sm font-medium">What changes from this trim?</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <select className="h-11 border border-border bg-bg px-3" value={fromId} onChange={(e) => setFromId(e.target.value)}>
              {grades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <select className="h-11 border border-border bg-bg px-3" value={toId} onChange={(e) => setToId(e.target.value)}>
              {grades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          {change ? (
            <ul className="mt-4 space-y-1 text-sm">
              <li>Price delta: {formatUsd(change.priceDelta)}</li>
              {change.added.map((item) => (
                <li key={`a-${item}`}>Adds: {item}</li>
              ))}
              {change.removed.map((item) => (
                <li key={`r-${item}`}>Removes: {item}</li>
              ))}
              {change.added.length === 0 && change.removed.length === 0 ? (
                <li>No standard-feature list differences in this catalog.</li>
              ) : null}
            </ul>
          ) : null}
          {facts.has3d ? (
            <p className="mt-3 text-xs text-muted">Open the 3D showroom to see paint and options that this capture supports.</p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
