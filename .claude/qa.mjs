import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "/tmp/qa";
mkdirSync(OUT, { recursive: true });
const BASE = "http://localhost:3000";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function smoothScrollTo(page, y) {
  // Lenis hijacks the wheel; drive its target via real scroll steps.
  await page.evaluate(async (target) => {
    const step = () =>
      new Promise((res) => requestAnimationFrame(() => res()));
    const total = target;
    const steps = 40;
    for (let i = 1; i <= steps; i++) {
      window.scrollTo(0, (total * i) / steps);
      await step();
    }
  }, y);
  await page.waitForTimeout(1400); // let Lenis + reveals settle
}

async function probe(page) {
  return page.evaluate(() => {
    const vw = window.innerWidth;
    // headline reveal state
    const spans = [...document.querySelectorAll(".reveal-line > span")];
    const spanStates = spans.slice(0, 6).map((s) => {
      const t = getComputedStyle(s).transform;
      const inView = (() => {
        const r = s.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0;
      })();
      // extract ty from matrix
      let ty = null;
      const m = t.match(/matrix\(([^)]+)\)/);
      if (m) ty = parseFloat(m[1].split(",")[5]);
      return { transform: t, ty, inView, text: s.textContent.slice(0, 24) };
    });
    // any fixed/abs element overflowing the right edge (the "stray rail")
    const strays = [];
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (cs.position !== "fixed" && cs.position !== "absolute") continue;
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.width < 60 && r.right > vw + 1 && r.height > 10) {
        strays.push({
          tag: el.tagName,
          cls: el.className?.toString?.().slice(0, 60),
          right: Math.round(r.right),
          width: Math.round(r.width),
          bg: cs.backgroundColor,
        });
      }
    }
    const doc = document.scrollingElement || document.documentElement;
    return {
      vw,
      docScrollWidth: doc.scrollWidth,
      docClientWidth: doc.clientWidth,
      hasHorizontalOverflow: doc.scrollWidth > doc.clientWidth + 1,
      spanStates,
      strays,
    };
  });
}

async function headerState(page) {
  return page.evaluate(() => {
    const header = document.querySelector("header");
    if (!header) return null;
    const cs = getComputedStyle(header);
    const logo = document.querySelector("header a[aria-label] span");
    const navLink = document.querySelector('header nav a');
    return {
      headerBg: cs.backgroundColor,
      logoColor: logo ? getComputedStyle(logo).color : null,
      navColor: navLink ? getComputedStyle(navLink).color : null,
    };
  });
}

async function headingColors(page) {
  return page.evaluate(() => {
    const out = [];
    for (const h of document.querySelectorAll("h1, h2, h3")) {
      const r = h.getBoundingClientRect();
      const cs = getComputedStyle(h);
      // background of nearest section
      let bgEl = h;
      let bg = "rgba(0, 0, 0, 0)";
      while (bgEl && bgEl !== document.body) {
        const c = getComputedStyle(bgEl).backgroundColor;
        if (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent") {
          bg = c;
          break;
        }
        bgEl = bgEl.parentElement;
      }
      out.push({
        text: h.textContent.trim().slice(0, 32),
        color: cs.color,
        bg,
      });
    }
    return out;
  });
}

function lum(rgbStr) {
  const m = rgbStr.match(/(\d+(\.\d+)?)/g);
  if (!m) return null;
  const [r, g, b] = m.map(Number);
  return Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
}

async function run() {
  const browser = await chromium.launch();
  const results = {};

  // ---------- DESKTOP ----------
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

  await page.goto(BASE, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2800); // hero immediate reveal completes

  // video state
  const video = await page.evaluate(() => {
    const v = document.querySelector("video");
    if (!v) return { exists: false };
    return {
      exists: true,
      readyState: v.readyState,
      networkState: v.networkState,
      videoWidth: v.videoWidth,
      paused: v.paused,
      currentSrc: v.currentSrc,
    };
  });

  await page.screenshot({ path: `${OUT}/01-home-hero.png` });
  results.heroProbe = await probe(page);
  results.heroHeader = await headerState(page);
  results.video = video;

  // scroll into the cream "Who We Are" section (~just past hero)
  await smoothScrollTo(page, 1000);
  await page.screenshot({ path: `${OUT}/02-home-overview.png` });
  results.overviewHeader = await headerState(page);

  // stat band region
  await smoothScrollTo(page, 1900);
  await page.screenshot({ path: `${OUT}/03-home-statband.png` });

  await smoothScrollTo(page, 3200);
  await page.screenshot({ path: `${OUT}/04-home-companies.png` });
  results.midProbe = await probe(page);

  // full page screenshot + heading color audit
  results.headingColors = await headingColors(page);
  await page.screenshot({ path: `${OUT}/05-home-full.png`, fullPage: true });

  // ---------- SUBPAGES ----------
  for (const slug of ["leadership", "projects", "services", "about"]) {
    await page.goto(`${BASE}/${slug}`, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(2600);
    results[`${slug}_probe`] = await probe(page);
    results[`${slug}_header`] = await headerState(page);
    await page.screenshot({ path: `${OUT}/sub-${slug}-top.png` });
  }
  await ctx.close();

  // ---------- MOBILE ----------
  const mctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mp = await mctx.newPage();
  await mp.goto(BASE, { waitUntil: "networkidle", timeout: 60000 });
  await mp.waitForTimeout(2500);
  await mp.screenshot({ path: `${OUT}/m-01-home.png` });
  // open hamburger
  const burger = mp.locator('button[aria-label="Open menu"]');
  results.mobileBurgerVisible = await burger.isVisible().catch(() => false);
  if (results.mobileBurgerVisible) {
    await burger.click();
    await mp.waitForTimeout(900);
    await mp.screenshot({ path: `${OUT}/m-02-menu.png` });
    results.bodyOverflowWhenMenuOpen = await mp.evaluate(
      () => getComputedStyle(document.body).overflow
    );
    const close = mp.locator('button[aria-label="Close menu"]');
    if (await close.isVisible().catch(() => false)) {
      await close.click();
      await mp.waitForTimeout(700);
    }
  }
  results.cursorDotOnMobile = await mp.evaluate(() => {
    const d = document.querySelector(".cursor-dot");
    if (!d) return "absent";
    return getComputedStyle(d).display;
  });
  await mctx.close();

  await browser.close();

  results.consoleErrors = errors.slice(0, 20);
  // annotate heading luminance contrast issues
  results.lightOnLightHeadings = results.headingColors
    .map((h) => ({ ...h, colorLum: lum(h.color), bgLum: lum(h.bg) }))
    .filter((h) => h.colorLum != null && h.bgLum != null && h.colorLum > 150 && h.bgLum > 150);

  console.log(JSON.stringify(results, null, 2));
}

run().catch((e) => {
  console.error("QA SCRIPT ERROR:", e);
  process.exit(1);
});
