import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Car, Ellipsis, House, MapPin, Search, X } from "lucide-react";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { SearchDialog } from "@/components/search/SearchDialog";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Home", icon: House, match: (p: string) => p === "/" },
  {
    href: "/vehicles",
    label: "Vehicles",
    icon: Car,
    match: (p: string) => p === "/vehicles" || p.startsWith("/vehicles/"),
  },
  {
    href: "/dealership",
    label: "Find a Dealer",
    icon: MapPin,
    match: (p: string) => p === "/dealership",
  },
] as const;

const MORE_LINKS = [
  { href: "/owners/saved", label: "Garage" },
  { href: "/shop", label: "Shop" },
  { href: "/shop/test-drive", label: "Test drive" },
  { href: "/shop/finance", label: "Finance" },
  { href: "/shop/trade-in", label: "Trade-in" },
  { href: "/owners/service", label: "Schedule service" },
  { href: "/owners", label: "Owners" },
  { href: "/vehicles/compare", label: "Compare" },
] as const;

export function MobileTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {moreOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/70"
            aria-label="Close menu"
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-border bg-surface px-5 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-4">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">More</h2>
              <button
                type="button"
                className="grid h-11 w-11 place-items-center"
                aria-label="Close"
                onClick={() => setMoreOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <nav className="grid gap-1">
              <button
                type="button"
                className="flex min-h-12 items-center border-b border-border text-left text-base"
                onClick={() => {
                  setMoreOpen(false);
                  setSearchOpen(true);
                }}
              >
                <Search size={16} className="mr-3 text-muted" />
                Search
              </button>
              {MORE_LINKS.map((item) => (
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
            </nav>
          </div>
        </div>
      ) : null}

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg pb-[env(safe-area-inset-bottom)] md:hidden"
        aria-label="Primary"
      >
        <ul className="grid h-16 grid-cols-4">
          {TABS.map((tab) => {
            const active = tab.match(pathname);
            const Icon = tab.icon;
            return (
              <li key={tab.href}>
                <Link
                  to={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-full flex-col items-center justify-center gap-1 text-xs",
                    active ? "text-accent" : "text-muted",
                  )}
                >
                  <Icon size={22} strokeWidth={active ? 1.4 : 1.7} fill={active ? "currentColor" : "none"} />
                  {tab.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              className={cn(
                "flex h-full w-full flex-col items-center justify-center gap-1 text-xs",
                moreOpen ? "text-accent" : "text-muted",
              )}
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen(true)}
            >
              <Ellipsis size={22} strokeWidth={2.2} />
              More
            </button>
          </li>
        </ul>
      </nav>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
