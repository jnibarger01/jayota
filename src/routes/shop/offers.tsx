import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { DEALER, OFFERS_UNAVAILABLE } from "@/lib/dealer";
import { loadOffersState } from "@/lib/catalog-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/shop/offers")({
  loader: () => loadOffersState(),
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
        <div className="mt-8 rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-semibold">Structured offers engine</h2>
          <p className="mt-2 text-sm text-muted">
            When a documented incentives feed is connected, each offer will include title, summary, applicable models,
            start/end dates, region, and disclosure. Until then this engine stays empty on purpose — no guessed APR,
            lease, or rebate figures.
          </p>
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-muted">Title</dt><dd>—</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Models</dt><dd>—</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Window</dt><dd>—</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Disclosure</dt><dd>Required before display</dd></div>
          </dl>
        </div>
        {state.offers.map((offer) => (
          <article key={offer.id} className="mt-4 rounded-2xl border border-border p-4">
            <h2 className="font-semibold">{offer.title}</h2>
            <p className="mt-2 text-sm text-muted">{offer.summary}</p>
            <p className="mt-2 text-xs text-muted">{offer.disclosure}</p>
          </article>
        ))}
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={DEALER.website} target="_blank" rel="noreferrer">
            <Button>See current programs on the dealer site</Button>
          </a>
        </div>
      </section>
    </SiteShell>
  );
}
