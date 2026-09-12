import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { getLineupBySlug } from "@/lib/lineup";
import { resetWorkspace, useShopper } from "@/lib/shopper";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/workspace")({
  head: () => pageHead("Deal workspace", "A shopping jacket for this visit — not a finalized dealership transaction."),
  component: WorkspacePage,
});

function WorkspacePage() {
  const shopper = useShopper();
  const model = shopper.workspace.slug ? getLineupBySlug(shopper.workspace.slug) : undefined;

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Shopping</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Deal workspace</h1>
        <p className="mt-3 text-sm text-muted">
          This is a digital jacket for your visit: model, build, inventory, trade notes, payment scenario, and test-drive
          request. Nothing here is a signed deal or an approved finance offer.
        </p>
        {!model ? (
          <p className="mt-8 text-sm text-muted">
            No vehicle selected yet.{" "}
            <Link to="/vehicles" className="underline">
              Choose a Toyota
            </Link>{" "}
            or run{" "}
            <Link to="/quiz" className="underline">
              Find My Toyota
            </Link>
            .
          </p>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface">
            <img src={model.image.src} alt={model.image.alt} className="aspect-video w-full object-cover" />
            <div className="grid gap-4 p-5">
              <h2 className="text-2xl font-semibold">{model.name}</h2>
              <Row label="Configuration" value={shopper.workspace.configurationHref ? "Build saved" : "Not selected"} href={shopper.workspace.configurationHref} />
              <Row label="Matching inventory" value={shopper.workspace.inventoryVin ?? "Feed not connected"} href="/shop/inventory" />
              <Row label="Trade-in" value={shopper.workspace.tradeNote ?? "No request yet"} href="/shop/trade-in" />
              <Row label="Payment scenario" value={shopper.workspace.scenarioId ?? "Open estimator"} href="/shop/finance" />
              <Row label="Test drive" value={shopper.workspace.testDriveHref ? "Request started" : "Not requested"} href={shopper.workspace.testDriveHref ?? "/shop/test-drive"} />
              <Row label="Favorite" value={shopper.favorites.includes(model.slug) ? "Saved" : "Not saved"} href="/owners/saved" />
            </div>
          </div>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => resetWorkspace()}>
            Reset workspace
          </Button>
          {model ? (
            <Link to="/vehicles/$slug" params={{ slug: model.slug }}>
              <Button>Edit vehicle</Button>
            </Link>
          ) : null}
        </div>
      </section>
    </SiteShell>
  );
}

function Row({ label, value, href }: { label: string; value: string; href?: string | null }) {
  const inner = (
    <div className="flex min-h-11 items-center justify-between gap-3 border-b border-border py-2 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}
