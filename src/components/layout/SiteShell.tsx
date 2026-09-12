import type { ReactNode } from "react";
import { useEffect } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { MobileTabBar } from "./MobileTabBar";
import { useShopper } from "@/lib/shopper";
import { cn } from "@/lib/utils";

function LocaleEffects() {
  const shopper = useShopper();
  useEffect(() => {
    document.documentElement.lang = shopper.locale;
    document.documentElement.classList.toggle("a11y-mode", shopper.a11yMode);
  }, [shopper.locale, shopper.a11yMode]);
  return null;
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <LocaleEffects />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-fg"
      >
        Skip to content
      </a>
      <SiteHeader />
      <div id="main" className={cn("site-main", "pad-tabbar md:pb-0")}>
        {children}
      </div>
      <div className="hidden md:block">
        <SiteFooter />
      </div>
      <MobileTabBar />
    </div>
  );
}
