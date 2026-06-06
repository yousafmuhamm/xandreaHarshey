import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
await page.mouse.move(720, 450);

async function wheelTo(targetY) {
  let guard = 0;
  while (guard++ < 120) {
    const y = await page.evaluate(() => window.scrollY);
    if (y >= targetY - 20) break;
    await page.mouse.wheel(0, 220);
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(1500); // settle + reveal
  return page.evaluate(() => window.scrollY);
}

function spanReport() {
  return page.evaluate(() => {
    const pick = (re) => {
      const h = [...document.querySelectorAll("h1,h2,h3")].find((x) =>
        re.test(x.textContent)
      );
      if (!h) return null;
      const span = h.querySelector(".reveal-line > span");
      const t = span ? getComputedStyle(span).transform : "n/a";
      const m = t.match(/matrix\(([^)]+)\)/);
      const ty = m ? parseFloat(m[1].split(",")[5]) : null;
      const r = h.getBoundingClientRect();
      return { text: h.textContent.trim().slice(0, 28), ty, inView: r.top < innerHeight && r.bottom > 0 };
    };
    return {
      who: pick(/Who We Are/i),
      companies: pick(/one standard of excellence/i),
      services: pick(/every division|Capabilities across/i),
    };
  });
}

const sy1 = await wheelTo(1100);
const r1 = await spanReport();
await page.screenshot({ path: "/tmp/qa/wheel-overview.png" });

const sy2 = await wheelTo(2600);
const r2 = await spanReport();
await page.screenshot({ path: "/tmp/qa/wheel-companies.png" });

console.log(JSON.stringify({ scrollY_1: sy1, afterOverview: r1, scrollY_2: sy2, afterCompanies: r2 }, null, 2));
await browser.close();
