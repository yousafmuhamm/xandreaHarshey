import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(2800);

const diag = await page.evaluate(() => {
  const ST = window.ScrollTrigger;
  if (!ST) return { hasST: false };
  const all = ST.getAll();
  const sample = all.slice(0, 8).map((t) => ({
    start: Math.round(t.start),
    end: Math.round(t.end),
    trigger: t.trigger?.tagName + "." + (t.trigger?.className?.toString?.().slice(0, 18) || ""),
    progress: +t.progress.toFixed(2),
    isActive: t.isActive,
  }));
  return {
    hasST: true,
    count: all.length,
    scrollerScrollTop: ST.scrollerCache ? null : undefined,
    windowScrollY: window.scrollY,
    stScroll: typeof all[0]?.scroll === "function" ? Math.round(all[0].scroll()) : null,
    sample,
  };
});
console.log("BEFORE SCROLL:", JSON.stringify(diag, null, 2));

// real wheel scroll
await page.mouse.move(720, 450);
for (let i = 0; i < 8; i++) {
  await page.mouse.wheel(0, 240);
  await page.waitForTimeout(110);
}
await page.waitForTimeout(1500);

const after = await page.evaluate(() => {
  const ST = window.ScrollTrigger;
  const all = ST.getAll();
  return {
    windowScrollY: window.scrollY,
    stScroll: typeof all[0]?.scroll === "function" ? Math.round(all[0].scroll()) : null,
    firstFew: all.slice(0, 6).map((t) => ({
      start: Math.round(t.start),
      progress: +t.progress.toFixed(2),
      isActive: t.isActive,
    })),
  };
});
console.log("AFTER WHEEL:", JSON.stringify(after, null, 2));

// Now force a manual update + refresh and re-check
const forced = await page.evaluate(() => {
  const ST = window.ScrollTrigger;
  ST.refresh();
  ST.update();
  const all = ST.getAll();
  return {
    windowScrollY: window.scrollY,
    stScroll: typeof all[0]?.scroll === "function" ? Math.round(all[0].scroll()) : null,
    firstFew: all.slice(0, 6).map((t) => ({
      start: Math.round(t.start),
      progress: +t.progress.toFixed(2),
      isActive: t.isActive,
    })),
  };
});
console.log("AFTER FORCED refresh+update:", JSON.stringify(forced, null, 2));

await browser.close();
