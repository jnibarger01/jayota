#!/usr/bin/env node
/**
 * Interactive coverage for the mobile tab bar.
 * Requires the app to already be serving (dev on :8080 or vite preview on :8081).
 * PR CI runs this against http://127.0.0.1:8081/ after `npm run build && npm run preview`.
 * Keep locators in sync with MobileTabBar + src/lib/mobile-nav.ts (see README).
 */
import { chromium } from "playwright";
import { checkedUrl } from "./browser-guard.mjs";

const url = checkedUrl(process.argv[2] || "http://127.0.0.1:8080/");
const timeoutMs = Number(process.env.MOBILE_NAV_SMOKE_TIMEOUT_MS || 20000);

const TABS = [
  { name: "Home", href: "/", path: "/" },
  { name: "Vehicles", href: "/vehicles", path: "/vehicles" },
  { name: "Find a Dealer", href: "/dealership", path: "/dealership" },
];

function fail(message, extra) {
  console.error(JSON.stringify({ ok: false, error: message, ...extra }, null, 2));
  process.exit(1);
}

const browser = await chromium.launch({ args: ["--disable-dev-shm-usage"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.setDefaultTimeout(timeoutMs);

try {
  await page.goto(url, { waitUntil: "networkidle" });
  const bar = page.locator('[data-mobile-tabbar="true"]');
  if (!(await bar.isVisible())) fail("mobile tab bar is not visible at 390x844");

  const box = await bar.boundingBox();
  if (!box) fail("mobile tab bar has no box");
  if (box.height < 44) fail("tab bar shorter than 44px", { box });
  if (Math.abs(box.y + box.height - 844) > 2) {
    fail("tab bar is not pinned to the bottom of the viewport", { box });
  }

  const links = bar.locator("a, button");
  const count = await links.count();
  if (count !== 4) fail("expected 4 tab actions", { count });

  for (let i = 0; i < count; i += 1) {
    const handle = links.nth(i);
    const target = await handle.boundingBox();
    if (!target || target.width < 44 || target.height < 44) {
      fail("tab target smaller than 44x44", { index: i, target });
    }
  }

  for (const tab of TABS) {
    const link = bar.locator(`a[href="${tab.href}"]`);
    await link.click();
    await page.waitForURL((next) => new URL(next).pathname === tab.path, { timeout: timeoutMs });
    const current = await link.getAttribute("aria-current");
    if (current !== "page") fail(`${tab.name} did not receive aria-current after navigation`);

    const hit = await page.evaluate(({ href }) => {
      const nav = document.querySelector('[data-mobile-tabbar="true"]');
      const el = nav?.querySelector(`a[href="${href}"]`);
      if (!el) return { ok: false, reason: "missing link" };
      const r = el.getBoundingClientRect();
      const x = r.x + r.width / 2;
      const y = r.y + r.height / 2;
      const top = document.elementFromPoint(x, y);
      return {
        ok: Boolean(top && (top === el || el.contains(top))),
        top: top ? `${top.tagName}.${typeof top.className === "string" ? top.className.slice(0, 60) : ""}` : null,
      };
    }, { href: tab.href });
    if (!hit.ok) fail(`${tab.name} is covered by another element`, hit);
  }

  await bar.getByRole("button", { name: "More" }).click();
  await page.getByRole("heading", { name: /More|Más/i }).waitFor();
  const moreStillVisible = await bar.isVisible();
  if (!moreStillVisible) fail("tab bar disappeared while More sheet was open");

  await page.locator("[data-mobile-more-search]").click({ force: true });
  await page.getByPlaceholder(/search models/i).waitFor();

  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);

  await bar.getByRole("button", { name: "More" }).click();
  await page.getByRole("link", { name: "Garage" }).click();
  await page.waitForURL((next) => new URL(next).pathname === "/owners/saved");

  console.log(
    JSON.stringify(
      {
        ok: true,
        tabs: TABS.map((t) => t.name).concat("More"),
        moreSearch: true,
        moreRoute: "/owners/saved",
      },
      null,
      2,
    ),
  );
} catch (err) {
  fail(err instanceof Error ? err.message : String(err));
} finally {
  await browser.close();
}
