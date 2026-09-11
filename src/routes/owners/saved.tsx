import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listSavedConfigurations, listSavedVehicles } from "@/lib/server/saved";
import { getLineupBySlug } from "@/lib/lineup";
import { getVehicleBySlug } from "@/showroom/data/vehicles";

export const Route = createFileRoute("/owners/saved")({ component: SavedPage });

function SavedPage() {
  const { user, isPending } = useCurrentUserState();
  const [vehicles, setVehicles] = useState<Array<{ vehicle_slug: string }>>([]);
  const [builds, setBuilds] = useState<Array<{ id: string; configuration_id: string; vehicle_slug: string; label: string | null }>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    Promise.all([listSavedVehicles(), listSavedConfigurations()])
      .then(([v, b]) => {
        if (cancelled) return;
        setVehicles(v);
        setBuilds(b);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load saved items.");
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (isPending) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-3xl px-4 py-24 text-sm text-muted">Loading account…</div>
      </SiteShell>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <h1 className="font-display text-5xl tracking-wide">Garage</h1>
        {error ? <p className="mt-4 text-sm text-accent">{error}</p> : null}
        <h2 className="mt-10 text-xs uppercase tracking-[0.2em] text-muted">Saved vehicles</h2>
        {vehicles.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No saved vehicles yet. Heart a model on the lineup to pin it here.</p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {vehicles.map((row) => {
              const lineup = getLineupBySlug(row.vehicle_slug);
              const vehicle = getVehicleBySlug(row.vehicle_slug);
              const label = lineup
                ? lineup.name
                : vehicle
                  ? `${vehicle.year} ${vehicle.model}`
                  : row.vehicle_slug;
              return (
                <li key={row.vehicle_slug} className="overflow-hidden rounded-2xl border border-border bg-surface">
                  <Link to="/vehicles/$slug" params={{ slug: lineup?.slug ?? row.vehicle_slug }} className="block">
                    {lineup ? (
                      <img src={lineup.image.src} alt={lineup.image.alt} className="aspect-video w-full object-cover" />
                    ) : null}
                    <div className="p-4">
                      <p className="font-semibold">{label}</p>
                      {lineup ? <p className="mt-1 text-sm text-muted">{lineup.tagline}</p> : null}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        <h2 className="mt-10 text-xs uppercase tracking-[0.2em] text-muted">Configurations</h2>
        {builds.length === 0 ? (
          <p className="mt-4 text-sm text-muted">
            Saved 3D builds also appear in the Garage inside the configurator. Pin a build there, then it can sync here when you are signed in.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {builds.map((row) => (
              <li key={row.id} className="border border-border bg-surface p-4 text-sm">
                <Link to="/vehicles/$slug/configure" params={{ slug: row.vehicle_slug }}>
                  {row.label ?? row.configuration_id}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SiteShell>
  );
}
