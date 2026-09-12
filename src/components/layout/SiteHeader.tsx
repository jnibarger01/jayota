import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { ToyotaMark } from "@/components/brand/ToyotaMark";
import { SearchDialog } from "@/components/search/SearchDialog";
import { LocaleControls } from "@/components/layout/LocaleControls";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/dealership", label: "Find a Dealer" },
] as const;

const MORE = [
  { href: "/quiz", label: "Find My Toyota" },
  { href: "/shop", label: "Shop" },
  { href: "/owners", label: "Owners" },
  { href: "/owners/saved", label: "Garage" },
  { href: "/workspace", label: "Deal workspace" },
  { href: "/shop/test-drive", label: "Test drive" },
  { href: "/owners/service", label: "Service" },
  { href: "/vehicles/compare", label: "Compare" },
  { href: "/shop/offers", label: "Offers" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/vehicles") {
    if (pathname === "/vehicles/compare" || pathname.startsWith("/vehicles/compare/")) return false;
    return pathname === "/vehicles" || pathname.startsWith("/vehicles/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function moreIsActive(pathname: string) {
  if (pathname === "/" || pathname === "/vehicles" || pathname === "/dealership") return false;
  if (pathname.startsWith("/vehicles/") && pathname !== "/vehicles/compare" && !pathname.startsWith("/vehicles/compare/")) {
    return false;
  }
  return true;
}

function BrandLockup() {
  return (
    <Link to="/" className="flex items-center gap-2.5 text-fg">
      <ToyotaMark className="h-6 w-9 text-fg" />
      <span className="text-sm font-semibold tracking-brand">TOYOTA</span>
    </Link>
  );
}

function SearchButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="inline-flex h-11 w-11 items-center justify-center text-fg"
      aria-label="Search"
      onClick={onClick}
    >
      <Search size={20} />
    </button>
  );
}

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [desktopNav, setDesktopNav] = useState(true);
  const home = pathname === "/";
  const moreActive = moreIsActive(pathname);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setDesktopNav(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {home ? (
        <header className="absolute inset-x-0 top-0 z-[var(--z-header)] md:hidden">
          <div className="flex h-[calc(3.5rem+env(safe-area-inset-top))] items-center justify-between px-4 pt-[env(safe-area-inset-top)]">
            <BrandLockup />
            <SearchButton onClick={() => setSearchOpen(true)} />
          </div>
        </header>
      ) : null}

      <header
        className="sticky top-0 z-[var(--z-header)] hidden border-b border-border bg-bg md:block"
        inert={desktopNav ? undefined : true}
        aria-hidden={desktopNav ? undefined : true}
      >
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6">
          <BrandLockup />
          <nav className="flex h-full items-center gap-1" aria-label="Primary">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex h-full items-center px-4 text-sm text-muted hover:text-fg",
                    active && "text-fg",
                  )}
                >
                  {item.label}
                  {active ? (
                    <span className="absolute inset-x-4 bottom-0 h-0.5 bg-accent" aria-hidden="true" />
                  ) : null}
                </Link>
              );
            })}
            <div className="relative h-full">
              <button
                type="button"
                className={cn(
                  "relative flex h-full items-center px-4 text-sm text-muted hover:text-fg",
                  (moreOpen || moreActive) && "text-fg",
                )}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                onClick={() => setMoreOpen((v) => !v)}
              >
                More
                {moreActive && !moreOpen ? (
                  <span className="absolute inset-x-4 bottom-0 h-0.5 bg-accent" aria-hidden="true" />
                ) : null}
              </button>
              {moreOpen ? (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-10 cursor-default"
                    aria-label="Close menu"
                    onClick={() => setMoreOpen(false)}
                  />
                  <div className="absolute left-1/2 top-full z-20 min-w-48 -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-surface py-2 shadow-[var(--shadow-elevated)]">
                    {MORE.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="flex min-h-11 items-center px-4 text-sm text-fg hover:bg-surface-2"
                        onClick={() => setMoreOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <SignedOut>
                      <Link
                        to="/login"
                        className="flex min-h-11 items-center px-4 text-sm text-fg hover:bg-surface-2"
                        onClick={() => setMoreOpen(false)}
                      >
                        Sign in
                      </Link>
                    </SignedOut>
                    <SignedIn>
                      <Link
                        to="/account"
                        className="flex min-h-11 items-center px-4 text-sm text-fg hover:bg-surface-2"
                        onClick={() => setMoreOpen(false)}
                      >
                        Account
                      </Link>
                    </SignedIn>
                  </div>
                </>
              ) : null}
            </div>
          </nav>
          <div className="flex items-center justify-self-end gap-1">
            <div className="hidden lg:block">
              <LocaleControls />
            </div>
            <SearchButton onClick={() => setSearchOpen(true)} />
          </div>
        </div>
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
