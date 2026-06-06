import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const OUT = "/tmp/qa5";
mkdirSync(OUT, { recursive: true });
const BASE = "http://localhost:3000";
const browser = await chromium.launch();
const R = {};

async function wheelTo(page, targetY) {
  await page.mouse.move(720, 450);
  let guard = 0;
  while (guard++ < 140) {
    const y = await page.evaluate(() => window.scrollY);
    if (y >= targetY - 25) break;
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(1500);
}
const tyOf = (page, re) =>
  page.evaluate((src) => {
    const rx = new RegExp(src, "i");
    const h = [...document.querySelectorAll("h1,h2,h3")].find((x) => rx.test(x.textContent));
    if (!h) return null;
    const s = h.querySelector(".reveal-line > span");
    const t = s ? getComputedStyle(s).transform : "n/a";
    const m = t.match(/matrix\(([^)]+)\)/);
    return { text: h.textContent.trim().slice(0, 26), ty: m ? +parseFloat(m[1].split(",")[5]).toFixed(1) : t };
  }, re.source ?? re);

// ---------- DESKTOP ----------
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(e.message));
page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(2600);
await page.screenshot({ path: `${OUT}/01-hero.png` });

await wheelTo(page, 1100);
R.whoHeading = await tyOf(page, /Who We Are/);
await page.screenshot({ path: `${OUT}/02-overview.png` });

await wheelTo(page, 2000);
await page.screenshot({ path: `${OUT}/03-statband.png` });

await wheelTo(page, 3100);
R.companyHeading = await tyOf(page, /one standard of excellence/);
// image reveal check
R.imgReveal = await page.evaluate(() => {
  const w = document.querySelector(".img-reveal");
  if (!w) return null;
  const cs = getComputedStyle(w);
  return { clipPath: cs.clipPath, inView: (() => { const r = w.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; })() };
});
await page.screenshot({ path: `${OUT}/04-companies.png` });

await wheelTo(page, 6000);
await page.screenshot({ path: `${OUT}/05-mid.png` });
await wheelTo(page, 100000);
await page.screenshot({ path: `${OUT}/06-footer.png` });
R.deskErrors = [...errs];
await ctx.close();

// ---------- SUBPAGE reveal-on-scroll ----------
const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p2 = await ctx2.newPage();
await p2.goto(`${BASE}/leadership`, { waitUntil: "networkidle" });
await p2.waitForTimeout(2400);
await wheelTo(p2, 1400);
R.execName = await tyOf(p2, /Alejandro|Ajit|Harlem/);
await p2.screenshot({ path: `${OUT}/07-leadership-execs.png` });
await ctx2.close();

// ---------- MOBILE ----------
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const mp = await mctx.newPage();
await mp.goto(BASE, { waitUntil: "networkidle" });
await mp.waitForTimeout(2500);
await mp.screenshot({ path: `${OUT}/m1-hero.png` });
R.mobile = await mp.evaluate(() => {
  const dot = document.querySelector(".cursor-dot");
  const h1span = document.querySelector("h1 .reveal-line > span");
  const r = h1span?.getBoundingClientRect();
  return {
    cursorDotDisplay: dot ? getComputedStyle(dot).display : "absent",
    firstHeadlineTop: r ? Math.round(r.top) : null, // should be >= header (~not negative/clipped)
    burgerVisible: !!document.querySelector('button[aria-label="Open menu"]'),
  };
});
await mp.locator('button[aria-label="Open menu"]').click();
await mp.waitForTimeout(900);
R.mobile.bodyOverflowMenuOpen = await mp.evaluate(() => getComputedStyle(document.body).overflow);
await mp.screenshot({ path: `${OUT}/m2-menu.png` });
await mctx.close();

// ---------- REDUCED MOTION ----------
const rctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const rp = await rctx.newPage();
await rp.goto(BASE, { waitUntil: "networkidle" });
await rp.waitForTimeout(1500);
R.reducedMotion = await rp.evaluate(() => {
  const spans = [...document.querySelectorAll(".reveal-line > span")].slice(0, 8);
  const allVisible = spans.every((s) => {
    const t = getComputedStyle(s).transform;
    return t === "none" || /matrix\(1, 0, 0, 1, 0, 0\)/.test(t);
  });
  // does an off-screen heading show its text (not stuck hidden)?
  return { spanCount: spans.length, allRevealedOrNone: allVisible, htmlHasLenis: document.documentElement.classList.contains("lenis") };
});
await rp.screenshot({ path: `${OUT}/r1-reducedmotion-top.png` });
await rctx.close();

await browser.close();
console.log(JSON.stringify(R, null, 2));
