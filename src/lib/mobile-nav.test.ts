import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MIN_TAB_TARGET_PX,
  MOBILE_MORE_LINKS,
  MOBILE_TABBAR_SELECTOR,
  MOBILE_TAB_HREFS,
  MOBILE_TABS,
} from "./mobile-nav.ts";

test("mobile tab bar exposes four actions with the required destinations", () => {
  assert.equal(MOBILE_TABS.length, 3);
  assert.equal(MOBILE_TAB_HREFS.home, "/");
  assert.equal(MOBILE_TAB_HREFS.vehicles, "/vehicles");
  assert.equal(MOBILE_TAB_HREFS.dealer, "/dealership");
  assert.equal(MOBILE_TABS[0]?.match("/"), true);
  assert.equal(MOBILE_TABS[1]?.match("/vehicles/rav4"), true);
  assert.equal(MOBILE_TABS[1]?.match("/vehicles/compare"), true);
  assert.equal(MOBILE_TABS[2]?.match("/dealership"), true);
  assert.equal(MOBILE_TABS[0]?.ariaLabel, "Home");
  assert.equal(MOBILE_TABS[2]?.ariaLabel, "Find a Dealer");
  assert.ok(MIN_TAB_TARGET_PX >= 44);
  assert.equal(MOBILE_TABBAR_SELECTOR, '[data-mobile-tabbar="true"]');
});

test("More sheet includes search-adjacent dealer tools", () => {
  const hrefs = MOBILE_MORE_LINKS.map((item) => item.href);
  assert.ok(hrefs.includes("/quiz"));
  assert.ok(hrefs.includes("/workspace"));
  assert.ok(hrefs.includes("/owners/saved"));
  assert.ok(hrefs.includes("/shop/test-drive"));
  assert.ok(hrefs.includes("/shop/finance"));
  assert.ok(hrefs.includes("/shop/trade-in"));
  assert.ok(hrefs.includes("/owners/service"));
  assert.equal(new Set(hrefs).size, hrefs.length);
});
