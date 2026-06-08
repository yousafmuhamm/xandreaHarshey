"""
Xandrea Harshey - Multi-viewport screenshot capture + mobile audit script.
Captures Desktop (1440x900), Mobile (390x844, iPhone 14), Tablet (768x1024)
for pages: /, /leadership, /services, /contact
"""

import os
import json
from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:3000"
OUTPUT_DIR = "/Users/muhammadyousaf/xandreaHarshey/screenshots"

VIEWPORTS = [
    {
        "name": "desktop",
        "width": 1440,
        "height": 900,
        "is_mobile": False,
        "has_touch": False,
        "device_scale_factor": 1,
        "user_agent": None,
    },
    {
        "name": "mobile",
        "width": 390,
        "height": 844,
        "is_mobile": True,
        "has_touch": True,
        "device_scale_factor": 2,
        "user_agent": (
            "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) "
            "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 "
            "Mobile/15E148 Safari/604.1"
        ),
    },
    {
        "name": "tablet",
        "width": 768,
        "height": 1024,
        "is_mobile": False,
        "has_touch": True,
        "device_scale_factor": 2,
        "user_agent": None,
    },
]

PAGES = [
    {"slug": "/", "name": "home"},
    {"slug": "/leadership", "name": "leadership"},
    {"slug": "/services", "name": "services"},
    {"slug": "/contact", "name": "contact"},
]


def capture(url, output_path, vp):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context_kwargs = {
            "viewport": {"width": vp["width"], "height": vp["height"]},
            "device_scale_factor": vp["device_scale_factor"],
            "is_mobile": vp["is_mobile"],
            "has_touch": vp["has_touch"],
        }
        if vp["user_agent"]:
            context_kwargs["user_agent"] = vp["user_agent"]

        context = browser.new_context(**context_kwargs)
        page = context.new_page()
        page.goto(url, wait_until="networkidle", timeout=30000)
        # Wait a beat for any GSAP/Lenis animations to settle
        page.wait_for_timeout(1500)
        page.screenshot(path=output_path, full_page=False)
        browser.close()
    print(f"  Saved: {output_path}")


def audit_page(url, vp):
    """Run programmatic checks on a page and return findings."""
    findings = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context_kwargs = {
            "viewport": {"width": vp["width"], "height": vp["height"]},
            "device_scale_factor": vp["device_scale_factor"],
            "is_mobile": vp["is_mobile"],
            "has_touch": vp["has_touch"],
        }
        if vp["user_agent"]:
            context_kwargs["user_agent"] = vp["user_agent"]

        context = browser.new_context(**context_kwargs)
        page = context.new_page()
        page.goto(url, wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(1500)

        # ---- 1. Viewport meta tag ----
        vp_meta = page.locator('meta[name="viewport"]').get_attribute("content")
        if vp_meta and "width=device-width" in vp_meta:
            findings.append({"check": "viewport_meta", "status": "PASS", "detail": vp_meta})
        else:
            findings.append({"check": "viewport_meta", "status": "FAIL", "detail": f"Missing or incorrect: {vp_meta}"})

        # ---- 2. Touch target sizes (buttons, nav links, CTAs) ----
        interactive = page.locator("a, button").all()
        small_targets = []
        for el in interactive[:60]:  # cap to avoid timeout
            try:
                box = el.bounding_box()
                if box and (box["width"] < 44 or box["height"] < 44):
                    text = (el.inner_text() or "").strip()[:40]
                    small_targets.append({
                        "text": text,
                        "w": round(box["width"], 1),
                        "h": round(box["height"], 1),
                        "x": round(box["x"], 1),
                        "y": round(box["y"], 1),
                    })
            except Exception:
                pass
        if small_targets:
            findings.append({"check": "touch_targets", "status": "WARN", "detail": small_targets[:10]})
        else:
            findings.append({"check": "touch_targets", "status": "PASS", "detail": "All sampled targets ≥44×44px"})

        # ---- 3. Font sizes ----
        font_check = page.evaluate("""() => {
            const els = document.querySelectorAll('p, span, li, a, label, input, textarea');
            const small = [];
            for (let el of els) {
                const sz = parseFloat(getComputedStyle(el).fontSize);
                if (sz < 14 && el.offsetParent !== null) {
                    small.push({tag: el.tagName, text: el.innerText?.slice(0,30), size: sz});
                    if (small.length >= 10) break;
                }
            }
            return small;
        }""")
        if font_check:
            findings.append({"check": "font_sizes_lt14px", "status": "WARN", "detail": font_check})
        else:
            findings.append({"check": "font_sizes_lt14px", "status": "PASS", "detail": "No visible text <14px found"})

        # ---- 4. Horizontal overflow ----
        overflow = page.evaluate("""() => {
            const docW = document.documentElement.scrollWidth;
            const winW = window.innerWidth;
            return {scrollWidth: docW, innerWidth: winW, overflows: docW > winW};
        }""")
        if overflow["overflows"]:
            findings.append({"check": "horizontal_overflow", "status": "FAIL",
                             "detail": f"scrollWidth={overflow['scrollWidth']} > innerWidth={overflow['innerWidth']}"})
        else:
            findings.append({"check": "horizontal_overflow", "status": "PASS", "detail": "No horizontal overflow"})

        # ---- 5. Hero section height (min-h-[100svh]) ----
        hero = page.locator("section").first
        try:
            hero_box = hero.bounding_box()
            if hero_box:
                ratio = hero_box["height"] / vp["height"]
                if ratio >= 0.95:
                    findings.append({"check": "hero_height", "status": "PASS",
                                     "detail": f"Hero h={round(hero_box['height'])}px ({round(ratio*100)}% viewport)"})
                else:
                    findings.append({"check": "hero_height", "status": "WARN",
                                     "detail": f"Hero h={round(hero_box['height'])}px ({round(ratio*100)}% viewport) — expected ~100svh"})
        except Exception as e:
            findings.append({"check": "hero_height", "status": "SKIP", "detail": str(e)})

        # ---- 6. Nav / hamburger visibility on mobile ----
        nav_els = page.locator("nav").all()
        hamburger_visible = False
        nav_visible = False
        for nav in nav_els:
            try:
                if nav.is_visible():
                    nav_visible = True
                    # Look for hamburger button inside nav
                    btns = nav.locator("button").all()
                    for btn in btns:
                        if btn.is_visible():
                            hamburger_visible = True
            except Exception:
                pass
        if vp["is_mobile"]:
            status = "PASS" if hamburger_visible else "WARN"
            findings.append({"check": "hamburger_menu_mobile", "status": status,
                             "detail": f"nav_visible={nav_visible}, hamburger_btn_visible={hamburger_visible}"})

        # ---- 7. next/image rendering ----
        img_check = page.evaluate("""() => {
            const imgs = document.querySelectorAll('img');
            const broken = [];
            for (let img of imgs) {
                if (!img.complete || img.naturalWidth === 0) {
                    broken.push({src: img.src?.slice(-60), alt: img.alt});
                    if (broken.length >= 5) break;
                }
            }
            return {total: imgs.length, broken};
        }""")
        if img_check["broken"]:
            findings.append({"check": "images", "status": "FAIL", "detail": img_check})
        else:
            findings.append({"check": "images", "status": "PASS",
                             "detail": f"{img_check['total']} images loaded, 0 broken"})

        # ---- 8. Hero headline above fold ----
        h1_check = page.evaluate("""(vpH) => {
            const h1 = document.querySelector('h1');
            if (!h1) return {found: false};
            const rect = h1.getBoundingClientRect();
            return {found: true, top: rect.top, bottom: rect.bottom, aboveFold: rect.top < vpH};
        }""", vp["height"])
        if h1_check.get("found"):
            status = "PASS" if h1_check.get("aboveFold") else "WARN"
            findings.append({"check": "h1_above_fold", "status": status,
                             "detail": f"H1 top={round(h1_check['top'])}px, bottom={round(h1_check['bottom'])}px"})
        else:
            findings.append({"check": "h1_above_fold", "status": "WARN", "detail": "No H1 found on page"})

        # ---- 9. Body font size ----
        body_font = page.evaluate("""() => {
            return parseFloat(getComputedStyle(document.body).fontSize);
        }""")
        status = "PASS" if body_font >= 16 else "WARN"
        findings.append({"check": "body_font_size", "status": status,
                         "detail": f"body font-size={body_font}px (need ≥16px)"})

        # ---- 10. CTA button sizes ----
        cta_check = page.evaluate("""() => {
            const btns = Array.from(document.querySelectorAll('a[href], button'))
                .filter(el => {
                    const t = el.innerText?.toLowerCase() || '';
                    return t.includes('contact') || t.includes('learn') || t.includes('get') ||
                           t.includes('book') || t.includes('schedule') || t.includes('inquire') ||
                           t.includes('submit') || t.includes('send');
                });
            return btns.map(b => {
                const r = b.getBoundingClientRect();
                return {text: b.innerText?.slice(0,30), w: Math.round(r.width), h: Math.round(r.height)};
            }).slice(0, 8);
        }""")
        small_ctas = [c for c in cta_check if c["w"] < 44 or c["h"] < 44]
        if small_ctas:
            findings.append({"check": "cta_button_sizes", "status": "WARN", "detail": small_ctas})
        else:
            findings.append({"check": "cta_button_sizes", "status": "PASS",
                             "detail": f"{len(cta_check)} CTA(s) found, all adequately sized"})

        # ---- 11. Form fields (contact page) ----
        if "contact" in url or "careers" in url:
            form_check = page.evaluate("""() => {
                const fields = document.querySelectorAll('input, textarea, select');
                return Array.from(fields).map(f => {
                    const r = f.getBoundingClientRect();
                    const fs = parseFloat(getComputedStyle(f).fontSize);
                    return {
                        type: f.type || f.tagName,
                        name: f.name || f.id,
                        h: Math.round(r.height),
                        fontSize: fs,
                        zoomRisk: fs < 16
                    };
                });
            }""")
            zoom_risk = [f for f in form_check if f.get("zoomRisk")]
            if zoom_risk:
                findings.append({"check": "form_field_font_size", "status": "WARN",
                                 "detail": f"Fields <16px (risk iOS zoom): {zoom_risk}"})
            else:
                findings.append({"check": "form_field_font_size", "status": "PASS",
                                 "detail": f"{len(form_check)} fields, all ≥16px font (no iOS zoom risk)"})

        # ---- 12. FOUC check (stylesheet loaded before paint) ----
        fouc_check = page.evaluate("""() => {
            const sheets = document.styleSheets;
            return {count: sheets.length, hasStyles: sheets.length > 0};
        }""")
        status = "PASS" if fouc_check["hasStyles"] else "FAIL"
        findings.append({"check": "fouc_stylesheets", "status": status,
                         "detail": f"{fouc_check['count']} stylesheet(s) loaded"})

        browser.close()
    return findings


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    all_results = {}

    for vp in VIEWPORTS:
        print(f"\n=== Viewport: {vp['name']} ({vp['width']}x{vp['height']}) ===")
        for pg in PAGES:
            url = BASE_URL + pg["slug"]
            filename = f"{vp['name']}_{pg['name']}.png"
            output_path = os.path.join(OUTPUT_DIR, filename)

            print(f"\n  Capturing {pg['slug']} ...")
            capture(url, output_path, vp)

            print(f"  Auditing {pg['slug']} ...")
            findings = audit_page(url, vp)

            key = f"{vp['name']}_{pg['name']}"
            all_results[key] = {
                "viewport": vp["name"],
                "page": pg["slug"],
                "screenshot": output_path,
                "findings": findings,
            }

    # Save JSON results
    json_path = os.path.join(OUTPUT_DIR, "audit_results.json")
    with open(json_path, "w") as f:
        json.dump(all_results, f, indent=2)
    print(f"\n\nAudit results saved to: {json_path}")
    return all_results


if __name__ == "__main__":
    main()
