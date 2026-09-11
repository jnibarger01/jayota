import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { MobileTabBar } from "./MobileTabBar";
import { cn } from "@/lib/utils";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const home = pathname === "/";

  return (
    <div className="site-shell">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-fg"
      >
        Skip to content
      </a>
      <SiteHeader />
      <div
        id="main"
        className={cn(!home && "pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0")}
      >
        {children}
      </div>
      <div className="hidden md:block">
        <SiteFooter />
      </div>
      <MobileTabBar />
    </div>
  );
}
