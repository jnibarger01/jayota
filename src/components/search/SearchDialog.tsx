import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useFocusTrap } from "@/lib/a11y/focus-trap";
import { highlightMatch, searchShowroom } from "@/lib/search-engine";
import { rememberQuery, useShopper } from "@/lib/shopper";
import { track } from "@/lib/analytics";

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const shopper = useShopper();
  const results = useMemo(() => searchShowroom(query), [query]);
  const flat = [...results.vehicles, ...results.destinations];
  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive((n) => Math.min(n + 1, Math.max(flat.length - 1, 0)));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive((n) => Math.max(n - 1, 0));
      }
      if (event.key === "Enter" && flat[active]) {
        event.preventDefault();
        rememberQuery(query);
        onOpenChange(false);
        window.location.assign(flat[active]!.href);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange, flat, active, query]);

  useEffect(() => {
    if (query.trim().length >= 2) track("search_performed", { qLength: query.trim().length, hits: flat.length });
  }, [query, flat.length]);

  if (!open) return null;

  const empty = query.trim().length >= 2 && flat.length === 0;

  return (
    <div className="mobile-dialog-layer flex items-start justify-center bg-ink/60 p-4 pt-[12vh] md:inset-0" role="presentation">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-xl rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-elevated)]"
      >
        <h2 id={titleId} className="sr-only">
          Search the showroom
        </h2>
        <input
          autoFocus
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          placeholder="Search models, hybrid AWD SUV, finance, service…"
          className="h-12 w-full rounded-xl border border-border bg-bg px-3 text-base text-fg placeholder:text-muted"
          aria-label="Search"
        />
        {shopper.recentQueries.length > 0 && !query.trim() ? (
          <div className="mt-3">
            <p className="text-xs uppercase tracking-widest text-muted">Recent</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {shopper.recentQueries.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="min-h-11 rounded-full border border-border px-3 text-sm"
                  onClick={() => setQuery(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-4 max-h-80 overflow-auto">
          {empty ? <p className="text-sm text-muted">No matches for “{query.trim()}”.</p> : null}
          {results.vehicles.length > 0 ? (
            <section>
              <h3 className="text-xs uppercase tracking-widest text-muted">Vehicles</h3>
              <ul className="mt-1 space-y-1">
                {results.vehicles.map((hit, index) => (
                  <li key={hit.href}>
                    <a
                      href={hit.href}
                      className={`flex min-h-11 items-center justify-between rounded-lg px-2 ${index === active ? "bg-surface-2" : "hover:bg-surface-2"}`}
                      onClick={() => {
                        rememberQuery(query);
                        onOpenChange(false);
                      }}
                    >
                      <span>
                        <Highlighted text={hit.title} query={query} />
                      </span>
                      <span className="text-xs text-muted">
                        <Highlighted text={hit.blurb} query={query} />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {results.destinations.length > 0 ? (
            <section className="mt-3 border-t border-border pt-3">
              <h3 className="text-xs uppercase tracking-widest text-muted">Destinations</h3>
              <ul className="mt-1 space-y-1">
                {results.destinations.map((hit, index) => (
                  <li key={hit.href}>
                    <a
                      href={hit.href}
                      className={`block min-h-11 rounded-lg px-2 py-2 ${results.vehicles.length + index === active ? "bg-surface-2" : "hover:bg-surface-2"}`}
                      onClick={() => {
                        rememberQuery(query);
                        onOpenChange(false);
                      }}
                    >
                      <strong className="block text-sm">
                        <Highlighted text={hit.title} query={query} />
                      </strong>
                      <span className="text-xs text-muted">
                        <Highlighted text={hit.blurb} query={query} />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
        <div className="mt-3 flex justify-end">
          <button type="button" className="min-h-11 px-3 text-sm text-muted" onClick={() => onOpenChange(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Highlighted({ text, query }: { text: string; query: string }) {
  const marked = highlightMatch(text, query);
  const parts = marked.split(/(«[^»]+»)/);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("«") && part.endsWith("»") ? (
          <mark key={index} className="rounded-sm bg-accent/30 text-fg">
            {part.slice(1, -1)}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}
