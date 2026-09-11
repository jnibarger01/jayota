import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { OWNER_TOOLS } from "@/lib/content";
import { pageHead } from "@/lib/seo";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/owners/")({
  head: () =>
    pageHead("Owners", "Service scheduling, maintenance resources, and saved vehicles for Toyota owners."),
  component: OwnersHub,
});

function OwnersHub() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Owners</p>
        <h1 className="mt-2 font-display text-5xl tracking-wide">Ownership</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Service requests are stored and reviewed by the dealership. They are not confirmed appointments until
          Hendrick Toyota Merriam accepts them.
        </p>
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {OWNER_TOOLS.map((tool) => (
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
