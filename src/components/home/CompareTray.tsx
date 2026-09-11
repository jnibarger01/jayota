import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { getLineupBySlug } from "@/lib/lineup";
import { MAX_COMPARE, clearCompare, toggleCompareSlug } from "@/lib/compare-tray";
import { MIN_COMPARE } from "@/showroom/api/client";

export function CompareTray({ slugs }: { slugs: string[] }) {
  if (slugs.length === 0) return null;
  const models = slugs.map((slug) => getLineupBySlug(slug)).filter((item) => Boolean(item));

  return (
    <div className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-30 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur-md md:bottom-0">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
        <p className="text-sm">
          Compare {slugs.length} of {MAX_COMPARE}
        </p>
        <ul className="flex flex-wrap gap-2">
          {models.map((model) =>
            model ? (
              <li key={model.slug}>
                <button
                  type="button"
                  className="inline-flex min-h-9 items-center gap-1 rounded-full bg-surface-2 px-3 text-xs"
                  onClick={() => toggleCompareSlug(model.slug)}
                >
                  {model.name} <X size={12} />
                </button>
              </li>
            ) : null,
          )}
        </ul>
        <div className="ml-auto flex gap-2">
          <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={() => clearCompare()}>
            Clear
          </button>
          {slugs.length >= MIN_COMPARE ? (
            <Link
              to="/vehicles/compare"
              search={{ vehicles: slugs.join(",") }}
              className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-sm text-accent-fg"
            >
              Compare
            </Link>
          ) : (
            <span className="inline-flex min-h-11 items-center text-sm text-muted">Add one more</span>
          )}
        </div>
      </div>
    </div>
  );
}
