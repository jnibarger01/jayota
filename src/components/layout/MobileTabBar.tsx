import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Car, Ellipsis, House, MapPin, Search, X } from "lucide-react";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { SearchDialog } from "@/components/search/SearchDialog";
import { LocaleControls } from "@/components/layout/LocaleControls";
import { MOBILE_MORE_LINKS, MOBILE_TABS } from "@/lib/mobile-nav";
import { COPY } from "@/lib/i18n";
import { useShopper } from "@/lib/shopper";
import { cn } from "@/lib/utils";

const ICONS = {
  "/": House,
  "/vehicles": Car,
  "/dealership": MapPin,
} as const;

export function MobileTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const shopper = useShopper();
  const t = COPY[shopper.locale];
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  const tabLabel = {
    "/": t.navHome,
    "/vehicles": t.navVehicles,
    "/dealership": t.navDealer,
  } as const;

  return (
    <>
      {moreOpen ? (
        <div className="mobile-sheet-layer md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/70"
            aria-label="Close menu"
            onClick={() => setMoreOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="false"
            aria-labelledby="mobile-more-title"
            className="absolute inset-x-0 bottom-0 max-h-[min(70svh,calc(100svh-var(--tabbar-total)-1rem))] overflow-auto rounded-t-3xl border-t border-border bg-surface px-5 pb-4 pt-4"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
            <div className="mb-3 flex items-center justify-between">
              <h2 id="mobile-more-title" className="text-lg font-semibold">
                {t.navMore}
              </h2>
              <button
                type="button"
                className="grid h-11 w-11 place-items-center"
                aria-label="Close"
                onClick={() => setMoreOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <nav className="grid gap-1" aria-label="More">
              <button
                type="button"
                data-mobile-more-search="true"
                className="flex min-h-12 items-center border-b border-border text-left text-base"
                onClick={() => {
                  setMoreOpen(false);
                  setSearchOpen(true);
                }}
              >
                <Search size={16} className="mr-3 text-muted" />
                {t.search}
              </button>
              {MOBILE_MORE_LINKS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex min-h-12 items-center border-b border-border text-base"
                  onClick={() => setMoreOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <SignedOut>
                <Link to="/login" className="flex min-h-12 items-center text-base" onClick={() => setMoreOpen(false)}>
                  Sign in
                </Link>
              </SignedOut>
              <SignedIn>
                <Link to="/account" className="flex min-h-12 items-center text-base" onClick={() => setMoreOpen(false)}>
                  Account
                </Link>
              </SignedIn>
              <div className="pt-3">
                <LocaleControls compact />
              </div>
            </nav>
          </div>
        </div>
      ) : null}

      <nav
        data-mobile-tabbar="true"
        className="mobile-tabbar md:hidden"
        aria-label="Mobile"
      >
        <ul className="grid h-16 grid-cols-4">
          {MOBILE_TABS.map((tab) => {
            const active = tab.match(pathname);
            const Icon = ICONS[tab.href];
            return (
              <li key={tab.href} className="min-w-0">
                <Link
                  to={tab.href}
                  aria-label={tab.ariaLabel}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-full min-h-11 w-full flex-col items-center justify-center gap-0.5 px-1 text-center text-xs leading-tight",
                    active ? "text-accent" : "text-muted",
                  )}
                >
                  <Icon size={22} strokeWidth={active ? 1.4 : 1.7} fill={active ? "currentColor" : "none"} />
                  {tabLabel[tab.href]}
                </Link>
              </li>
            );
          })}
          <li className="min-w-0">
            <button
              type="button"
              className={cn(
                "flex h-full min-h-11 w-full flex-col items-center justify-center gap-0.5 px-1 text-center text-xs leading-tight",
                moreOpen ? "text-accent" : "text-muted",
              )}
              aria-label="More"
              aria-expanded={moreOpen}
              aria-controls={moreOpen ? "mobile-more-title" : undefined}
              onClick={() => setMoreOpen((open) => !open)}
            >
              <Ellipsis size={22} strokeWidth={2.2} />
              {t.navMore}
            </button>
          </li>
        </ul>
      </nav>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
