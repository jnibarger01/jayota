import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listSavedConfigurations, listSavedVehicles } from "@/lib/server/saved";
import { getLineupBySlug } from "@/lib/lineup";
import { getVehicleBySlug } from "@/showroom/data/vehicles";
import { removeBuild, removeRecent, removeSearch, toggleLocalFavorite, useShopper } from "@/lib/shopper";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/owners/saved")({
  head: () => pageHead("Garage", "Saved vehicles, builds, searches, and recent shopping."),
  component: SavedPage,
});

function SavedPage() {
  const { user, isPending } = useCurrentUserState();
  const shopper = useShopper();
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

  const localFavs = shopper.favorites
    .map((slug) => getLineupBySlug(slug))
    .filter(Boolean);
  const accountFavs = vehicles.map((row) => {
    const lineup = getLineupBySlug(row.vehicle_slug);
    const vehicle = getVehicleBySlug(row.vehicle_slug);
    return { slug: row.vehicle_slug, name: lineup?.name ?? (vehicle ? `${vehicle.year} ${vehicle.model}` : row.vehicle_slug), image: lineup?.image };
  });

  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <h1 className="font-display text-5xl tracking-wide">Garage</h1>
        <p className="mt-3 text-sm text-muted">
          Signed-out favorites stay in this browser. Signed-in favorites also save to your account. Local history is
          never silently discarded when you sign in.
        </p>
        {isPending ? <p className="mt-4 text-sm text-muted">Checking account…</p> : null}
        {error ? <p className="mt-4 text-sm text-accent">{error}</p> : null}

        <Section title="Favorite vehicles">
          {localFavs.length === 0 && accountFavs.length === 0 ? (
            <p className="text-sm text-muted">Heart a model on the lineup to pin it here.</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {[...accountFavs.map((item) => ({ ...item, source: "account" as const })), ...localFavs.map((item) => ({ slug: item!.slug, name: item!.name, image: item!.image, source: "local" as const }))].map((item) => (
                <li key={`${item.source}-${item.slug}`} className="overflow-hidden rounded-2xl border border-border bg-surface">
                  <Link to="/vehicles/$slug" params={{ slug: item.slug }} className="block">
                    {item.image ? <img src={item.image.src} alt={item.image.alt} className="aspect-video w-full object-cover" /> : null}
                    <div className="p-4">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs text-muted">{item.source === "account" ? "Account" : "This device"}</p>
                    </div>
                  </Link>
                  <div className="flex gap-2 px-4 pb-4">
                    <Link to="/shop/inventory" search={{ model: item.name }} className="text-xs underline">View inventory</Link>
                    <Link to="/vehicles/compare" search={{ vehicles: item.slug }} className="text-xs underline">Compare</Link>
                    <button type="button" className="text-xs text-muted" onClick={() => toggleLocalFavorite(item.slug)}>Remove local</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Saved builds">
          {shopper.builds.length === 0 && builds.length === 0 ? (
            <p className="text-sm text-muted">Share or pin a configuration from the 3D builder.</p>
          ) : (
            <ul className="grid gap-2">
              {shopper.builds.map((build) => (
                <li key={build.id} className="flex min-h-11 items-center justify-between gap-3 border-b border-border py-2">
                  <a href={build.href} className="text-sm">
                    {build.label}
                  </a>
                  <button type="button" className="text-xs text-muted" onClick={() => removeBuild(build.id)}>
                    Remove
                  </button>
                </li>
              ))}
              {builds.map((build) => (
                <li key={build.id} className="flex min-h-11 items-center justify-between gap-3 border-b border-border py-2 text-sm">
                  <Link to="/vehicles/$slug/configure" params={{ slug: build.vehicle_slug }}>
                    Resume {build.label ?? build.vehicle_slug}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Recently viewed">
          {shopper.recent.length === 0 ? (
            <p className="text-sm text-muted">Open a model page to start a history.</p>
          ) : (
            <ul className="flex gap-3 overflow-x-auto">
              {shopper.recent.map((item) => {
                const model = getLineupBySlug(item.slug);
                if (!model) return null;
                return (
                  <li key={item.slug} className="w-40 shrink-0">
                    <Link to="/vehicles/$slug" params={{ slug: model.slug }}>
                      <img src={model.image.src} alt="" className="aspect-video w-full rounded-xl object-cover" />
                      <p className="mt-1 text-sm">{model.name}</p>
                    </Link>
                    <button type="button" className="text-xs text-muted" onClick={() => removeRecent(item.slug)}>Remove</button>
                  </li>
                );
              })}
            </ul>
          )}
        </Section>

        <Section title="Saved comparisons">
          {shopper.comparisons.length === 0 ? (
            <p className="text-sm text-muted">Compare two or more models to pin a comparison here.</p>
          ) : (
            <ul className="grid gap-2">
              {shopper.comparisons.map((row) => (
                <li key={row.join("-")} className="flex min-h-11 items-center justify-between gap-3 border-b border-border">
                  <Link to="/vehicles/compare" search={{ vehicles: row.join(",") }} className="text-sm">
                    Resume {row.map((slug) => getLineupBySlug(slug)?.name ?? slug).join(" vs ")}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Saved inventory searches">
          {shopper.searches.length === 0 ? (
            <p className="text-sm text-muted">Save a filter set from Inventory. This app does not send push alerts.</p>
          ) : (
            <ul className="grid gap-2">
              {shopper.searches.map((item) => (
                <li key={item.id} className="flex min-h-11 items-center justify-between gap-3 border-b border-border">
                  <a href={item.href} className="text-sm">{item.name}</a>
                  <button type="button" className="text-xs text-muted" onClick={() => removeSearch(item.id)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Test-drive requests">
          {shopper.testDriveRequests.length === 0 ? (
            <p className="text-sm text-muted">Submitted requests on this device appear here.</p>
          ) : (
            <ul className="grid gap-2 text-sm">
              {shopper.testDriveRequests.map((item) => (
                <li key={item.id}>
                  {item.slug} · {item.label} · {item.id}
                </li>
              ))}
            </ul>
          )}
        </Section>
      </section>
    </SiteShell>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xs uppercase tracking-[0.2em] text-muted">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
