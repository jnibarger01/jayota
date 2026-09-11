import { useEffect, useId, useState } from "react";
import { Link } from "@tanstack/react-router";
import { searchSite } from "@/lib/server/catalog";
import type { VehicleSummary } from "@/showroom/types/vehicle";
import { track } from "@/lib/analytics";

type LineupHit = { slug: string; name: string; tagline: string };
type ResourceHit = { href: string; title: string; blurb: string };

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const titleId = useId();
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [vehicles, setVehicles] = useState<VehicleSummary[]>([]);
  const [lineup, setLineup] = useState<LineupHit[]>([]);
  const [resources, setResources] = useState<ResourceHit[]>([]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const handle = window.setTimeout(() => {
      const q = query.trim();
      if (!q) {
        setVehicles([]);
        setLineup([]);
        setResources([]);
        setBusy(false);
        return;
      }
      setBusy(true);
      void searchSite({ data: { q } })
        .then((result) => {
          setVehicles(result.vehicles);
          setLineup(result.lineup);
          setResources(result.resources);
          track("search_performed", {
            qLength: q.length,
            hits: result.vehicles.length + result.lineup.length + result.resources.length,
          });
        })
        .finally(() => setBusy(false));
    }, 220);
    return () => window.clearTimeout(handle);
  }, [query, open]);

  if (!open) return null;

  const empty = !busy && query.trim() && vehicles.length === 0 && lineup.length === 0 && resources.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/60 p-4 pt-[12vh]" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-xl rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-elevated)]"
      >
        <h2 id={titleId} className="sr-only">
          Search the showroom
        </h2>
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search models, service, finance…"
          className="h-12 w-full rounded-xl border border-border bg-bg px-3 text-base text-fg placeholder:text-muted"
          aria-label="Search"
        />
        <div className="mt-4 max-h-80 overflow-auto">
          {busy ? <p className="text-sm text-muted">Searching…</p> : null}
          {empty ? <p className="text-sm text-muted">No matches for “{query.trim()}”.</p> : null}
          {vehicles.length > 0 ? (
            <ul className="space-y-1">
              {vehicles.map((vehicle) => (
                <li key={vehicle.slug}>
                  <Link
                    to="/vehicles/$slug"
                    params={{ slug: vehicle.slug }}
                    className="flex min-h-11 items-center justify-between rounded-lg px-2 hover:bg-surface-2"
                    onClick={() => onOpenChange(false)}
                  >
                    <span>
                      {vehicle.year} {vehicle.model}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-muted">{vehicle.bodyStyle}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          {lineup.length > 0 ? (
            <ul className="space-y-1">
              {lineup.map((item) => (
                <li key={item.slug}>
                  <Link
                    to="/vehicles/$slug"
                    params={{ slug: item.slug }}
                    className="flex min-h-11 items-center justify-between rounded-lg px-2 hover:bg-surface-2"
                    onClick={() => onOpenChange(false)}
                  >
                    <span>{item.name}</span>
                    <span className="text-xs text-muted">{item.tagline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          {resources.length > 0 ? (
            <ul className="mt-3 space-y-1 border-t border-border pt-3">
              {resources.map((resource) => (
                <li key={resource.href}>
                  <a
                    href={resource.href}
                    className="block min-h-11 rounded-lg px-2 py-2 hover:bg-surface-2"
                    onClick={() => onOpenChange(false)}
                  >
                    <strong className="block text-sm">{resource.title}</strong>
                    <span className="text-xs text-muted">{resource.blurb}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="mt-3 flex justify-end">
          <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={() => onOpenChange(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
