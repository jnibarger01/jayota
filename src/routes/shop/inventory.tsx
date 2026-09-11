import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { DEALER, INVENTORY_UNAVAILABLE } from "@/lib/dealer";
import { getInventoryState } from "@/lib/server/catalog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/shop/inventory")({
  loader: () => getInventoryState(),
  component: InventoryPage,
});

function InventoryPage() {
  const state = Route.useLoaderData();
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Shop</p>
        <h1 className="mt-2 font-display text-5xl tracking-wide">Inventory</h1>
        <p className="mt-6 text-sm leading-relaxed text-muted">{INVENTORY_UNAVAILABLE}</p>
        <p className="mt-4 text-sm text-muted">
          Provider status: <strong className="text-fg">{state.status}</strong> ({state.provider}).
          {state.vehicles.length === 0 ? " No vehicles returned." : null}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={DEALER.website} target="_blank" rel="noreferrer">
            <Button>Check the official dealer site</Button>
          </a>
          <a href={`tel:${DEALER.phone.generalTel}`}>
            <Button variant="secondary">Call {DEALER.phone.general}</Button>
          </a>
        </div>
        <p className="price-note mt-8">
          Required to go live: a documented inventory feed URL, auth token, and VIN-level contract. Until those exist, this page stays empty on purpose.
        </p>
      </section>
    </SiteShell>
  );
}
