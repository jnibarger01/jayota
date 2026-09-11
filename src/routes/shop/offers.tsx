import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { DEALER, OFFERS_UNAVAILABLE } from "@/lib/dealer";
import { getOffersState } from "@/lib/server/catalog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/shop/offers")({
  loader: () => getOffersState(),
  component: OffersPage,
});

function OffersPage() {
  const state = Route.useLoaderData();
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <h1 className="font-display text-5xl tracking-wide">Offers</h1>
        <p className="mt-6 text-sm leading-relaxed text-muted">{OFFERS_UNAVAILABLE}</p>
        <p className="mt-4 text-sm text-muted">
          Provider status: <strong className="text-fg">{state.status}</strong>. {state.offers.length} active offers loaded.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={DEALER.website} target="_blank" rel="noreferrer">
            <Button>See current programs on the dealer site</Button>
          </a>
        </div>
      </section>
    </SiteShell>
  );
}
