import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { SHOP_TOOLS } from "@/lib/content";
import { pageHead } from "@/lib/seo";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/shop/")({
  head: () =>
    pageHead("Shop", "Inventory, finance, trade-in, test drives, and offers at Hendrick Toyota Merriam."),
  component: ShopHub,
});

function ShopHub() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Shop</p>
        <h1 className="mt-2 font-display text-5xl tracking-wide">Shopping tools</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Every tool either talks to a live provider or tells you plainly that the provider is not connected.
          No invented inventory, APR, or trade values.
        </p>
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {SHOP_TOOLS.map((tool) => (
            <li key={tool.to}>
              <Link to={tool.to} className="flex min-h-32 flex-col justify-between border border-border bg-surface p-6 hover:bg-surface-2">
                <div>
                  <h2 className="font-display text-2xl">{tool.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{tool.body}</p>
                </div>
                <span className="mt-6 inline-flex items-center gap-1 text-xs uppercase tracking-[0.16em]">
                  Open <ChevronRight size={14} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </SiteShell>
  );
}
