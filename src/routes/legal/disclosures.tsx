import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { CATALOG_DISCLAIMER, FINANCE_DISCLAIMER, INVENTORY_UNAVAILABLE, OFFERS_UNAVAILABLE } from "@/lib/dealer";

export const Route = createFileRoute("/legal/disclosures")({ component: DisclosuresPage });

function DisclosuresPage() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-2xl px-4 py-16 md:px-6">
        <h1 className="font-display text-5xl tracking-wide">Disclosures</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
          <p>{CATALOG_DISCLAIMER}</p>
          <p>{FINANCE_DISCLAIMER}</p>
          <p>{INVENTORY_UNAVAILABLE}</p>
          <p>{OFFERS_UNAVAILABLE}</p>
          <p>
            Toyota, the Toyota logo, and model names are trademarks of Toyota Motor Corporation. This
            independent dealership site is not toyota.com. 3D assets are project-packaged visualization
            models, not factory-certified configurators.
          </p>
        </div>
      </article>
    </SiteShell>
  );
}
