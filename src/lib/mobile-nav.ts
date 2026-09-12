/**
 * Mobile tab bar contract.
 * Keep this in sync with MobileTabBar — tests import these hrefs so a
 * regression that drops a tab or covers the bar is caught in CI.
 */
export const MOBILE_TAB_HREFS = {
  home: "/",
  vehicles: "/vehicles",
  dealer: "/dealership",
} as const;

export const MOBILE_TABS = [
  {
    href: MOBILE_TAB_HREFS.home,
    label: "Home",
    ariaLabel: "Home",
    match: (p: string) => p === "/",
  },
  {
    href: MOBILE_TAB_HREFS.vehicles,
    label: "Vehicles",
    ariaLabel: "Vehicles",
    match: (p: string) => p === "/vehicles" || p.startsWith("/vehicles/"),
  },
  {
    href: MOBILE_TAB_HREFS.dealer,
    label: "Dealer",
    ariaLabel: "Find a Dealer",
    match: (p: string) => p === "/dealership",
  },
] as const;

export const MOBILE_MORE_LINKS = [
  { href: "/quiz", label: "Find My Toyota" },
  { href: "/owners/saved", label: "Garage" },
  { href: "/workspace", label: "Deal workspace" },
  { href: "/shop", label: "Shop" },
  { href: "/shop/test-drive", label: "Test drive" },
  { href: "/shop/finance", label: "Finance" },
  { href: "/shop/trade-in", label: "Trade-in" },
  { href: "/owners/service", label: "Schedule service" },
  { href: "/owners", label: "Owners" },
  { href: "/vehicles/compare", label: "Compare" },
] as const;

export const MOBILE_TABBAR_SELECTOR = '[data-mobile-tabbar="true"]';
export const MIN_TAB_TARGET_PX = 44;
