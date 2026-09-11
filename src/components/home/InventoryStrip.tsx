import { Link } from "@tanstack/react-router";
import { DEALER, INVENTORY_UNAVAILABLE } from "@/lib/dealer";

export function InventoryStrip({
  status,
  provider,
  count,
}: {
  status: "unavailable" | "configured";
  provider: string;
  count: number;
}) {
  return (
    <section className="border-t border-border bg-surface px-5 py-10 pb-[calc(7rem+env(safe-area-inset-bottom))] md:px-6 md:pb-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-semibold tracking-tight">Inventory & pricing</h2>
        {status === "unavailable" ? (
          <>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{INVENTORY_UNAVAILABLE}</p>
            <p className="mt-2 text-xs text-muted">
              Provider: {provider}. {count} vehicles returned.
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted">
            Live inventory is connected ({count} vehicles). Confirm stock, VIN, and selling price with the
            dealership before traveling.
          </p>
        )}
        <p className="mt-3 max-w-3xl text-sm text-muted">
          Starting MSRP on this page is a published Toyota.com catalog figure — not a Hendrick advertised
          price, not an APR, and not a promise the vehicle is on the lot.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={DEALER.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center rounded-full bg-pill px-5 text-sm font-medium text-pill-fg"
          >
            Check the dealer site
          </a>
          <a
            href={`tel:${DEALER.phone.generalTel}`}
            className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm"
          >
            Call {DEALER.phone.general}
          </a>
          <Link to="/shop/inventory" className="inline-flex min-h-11 items-center px-3 text-sm text-muted">
            Inventory status
          </Link>
        </div>
      </div>
    </section>
  );
}
