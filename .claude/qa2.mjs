import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(2500);

// scroll precisely to the overview heading
await page.evaluate(async () => {
  const steps = 50, target = 1050;
  for (let i = 1; i <= steps; i++) {
    window.scrollTo(0, (target * i) / steps);
    await new Promise((r) => requestAnimationFrame(r));
  }
});
await page.waitForTimeout(1600);

const overview = await page.evaluate(() => {
  const heads = [...document.querySelectorAll("h2")];
  const who = heads.find((h) => /Who We Are/i.test(h.textContent));
  if (!who) return { found: false };
  const span = who.querySelector(".reveal-line > span");
  const r = who.getBoundingClientRect();
  const cs = getComputedStyle(who);
  return {
    found: true,
    text: who.textContent.trim(),
    color: cs.color,
    fontSize: cs.fontSize,
    rectTop: Math.round(r.top),
    rectInView: r.top < window.innerHeight && r.bottom > 0,
    spanTransform: span ? getComputedStyle(span).transform : null,
  };
});
await page.screenshot({ path: "/tmp/qa/overview-zoom.png" });

// recognition marquee
const marquee = await page.evaluate(() => {
  const track = document.querySelector(".marquee-track");
  return {
    exists: !!track,
    childCount: track ? track.children.length : 0,
    animation: track ? getComputedStyle(track).animationName : null,
  };
});
console.log(JSON.stringify({ overview, marquee }, null, 2));
await browser.close();
