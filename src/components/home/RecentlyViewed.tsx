import { Link } from "@tanstack/react-router";
import { getLineupBySlug } from "@/lib/lineup";
import { COPY, type Locale } from "@/lib/i18n";
import type { RecentView } from "@/lib/shopper";

export function RecentlyViewed({
  items,
  locale,
  onClear,
  onRemove,
}: {
  items: RecentView[];
  locale: Locale;
  onClear: () => void;
  onRemove: (slug: string) => void;
}) {
  const models = items.map((item) => getLineupBySlug(item.slug)).filter(Boolean);
  if (models.length === 0) return null;
  const t = COPY[locale];

  return (
    <section className="border-t border-border px-5 py-10 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">{t.recently}</h2>
          <button type="button" className="min-h-11 text-sm text-muted" onClick={onClear}>
            Clear history
          </button>
        </div>
        <ul className="mt-5 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
          {items.map((item) => {
            const model = getLineupBySlug(item.slug);
            if (!model) return null;
            return (
              <li key={item.slug} className="w-52 shrink-0">
                <Link to="/vehicles/$slug" params={{ slug: model.slug }} className="block overflow-hidden rounded-2xl bg-surface">
                  <img src={model.image.src} alt="" className="aspect-video w-full object-cover" />
                  <p className="px-3 py-2 text-sm font-medium">{model.name}</p>
                </Link>
                <button type="button" className="mt-1 min-h-11 px-1 text-xs text-muted" onClick={() => onRemove(item.slug)}>
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
