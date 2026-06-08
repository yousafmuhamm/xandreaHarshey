"""
Full mobile rendering audit — Xandrea Harshey Services Inc.
Viewport: 390x844, deviceScaleFactor:2, iPhone 14 UA.
Pages: /, /about, /companies, /services, /construction,
       /facility-services, /leadership, /contact, /careers,
       /projects, /safety
Also captures the mobile nav overlay (hamburger open state).
"""

import os
import json
from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:3000"
OUTPUT_DIR = "/Users/muhammadyousaf/xandreaHarshey/screenshots/mobile-audit"

MOBILE_VP = {
    "width": 390,
    "height": 844,
    "is_mobile": True,
    "has_touch": True,
    "device_scale_factor": 2,
    "user_agent": (
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) "
        "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 "
        "Mobile/15E148 Safari/604.1"
    ),
}

PAGES = [
    {"slug": "/",                  "name": "home"},
    {"slug": "/about",             "name": "about"},
    {"slug": "/companies",         "name": "companies"},
    {"slug": "/services",          "name": "services"},
    {"slug": "/construction",      "name": "construction"},
    {"slug": "/facility-services", "name": "facility_services"},
    {"slug": "/leadership",        "name": "leadership"},
    {"slug": "/contact",           "name": "contact"},
    {"slug": "/careers",           "name": "careers"},
    {"slug": "/projects",          "name": "projects"},
    {"slug": "/safety",            "name": "safety"},
]


def make_context(p):
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": MOBILE_VP["width"], "height": MOBILE_VP["height"]},
        device_scale_factor=MOBILE_VP["device_scale_factor"],
        is_mobile=MOBILE_VP["is_mobile"],
        has_touch=MOBILE_VP["has_touch"],
        user_agent=MOBILE_VP["user_agent"],
    )
    return browser, context


def capture_page(url, output_path, wait_ms=2000):
    with sync_playwright() as p:
        browser, context = make_context(p)
        page = context.new_page()
        page.goto(url, wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(wait_ms)
        page.screenshot(path=output_path, full_page=False)
        browser.close()
    print(f"  [screenshot] {output_path}")


def capture_nav_open(url, output_path):
    """Open page, click the hamburger, wait for overlay, screenshot."""
    with sync_playwright() as p:
        browser, context = make_context(p)
        page = context.new_page()
        page.goto(url, wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(1500)
        # The hamburger is the button[aria-label="Open menu"]
        btn = page.locator('button[aria-label="Open menu"]')
        btn.wait_for(state="visible", timeout=5000)
        btn.click()
        # Wait for the framer-motion overlay to fully animate in
        page.wait_for_timeout(1200)
        page.screenshot(path=output_path, full_page=False)
        browser.close()
    print(f"  [nav-open screenshot] {output_path}")


def audit_page(url, pg_name):
    """Run all programmatic checks. Returns dict of findings."""
    findings = {}
    with sync_playwright() as p:
        browser, context = make_context(p)
        page = context.new_page()
        page.goto(url, wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(2000)

        # 1. Viewport meta
        vp_meta = page.locator('meta[name="viewport"]').get_attribute("content") or ""
        findings["viewport_meta"] = {
            "status": "PASS" if "width=device-width" in vp_meta else "FAIL",
            "detail": vp_meta or "missing",
        }

        # 2. Horizontal overflow
        overflow = page.evaluate("""() => {
            const docW = document.documentElement.scrollWidth;
            const winW = window.innerWidth;
            // also find which element causes overflow
            const overflowing = [];
            document.querySelectorAll('*').forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.right > winW + 2) {
                    const cls = el.className?.toString?.().slice(0,80) || '';
                    const tag = el.tagName;
                    overflowing.push({tag, cls, right: Math.round(rect.right), winW});
                    if (overflowing.length >= 6) return;
                }
            });
            return {scrollWidth: docW, innerWidth: winW, overflows: docW > winW, offenders: overflowing.slice(0,6)};
        }""")
        findings["horizontal_overflow"] = {
            "status": "FAIL" if overflow["overflows"] else "PASS",
            "detail": overflow,
        }

        # 3. Touch targets
        interactive = page.locator("a, button").all()
        small_targets = []
        for el in interactive[:80]:
            try:
                box = el.bounding_box()
                if box and (box["width"] < 44 or box["height"] < 44):
                    text = (el.inner_text() or "").strip()[:50]
                    small_targets.append({
                        "text": text,
                        "w": round(box["width"], 1),
                        "h": round(box["height"], 1),
                        "x": round(box["x"], 1),
                        "y": round(box["y"], 1),
                    })
            except Exception:
                pass
        findings["touch_targets"] = {
            "status": "WARN" if small_targets else "PASS",
            "detail": small_targets[:12],
        }

        # 4. Font sizes < 14px (visible elements)
        small_fonts = page.evaluate("""() => {
            const els = document.querySelectorAll('p, span, li, a, label, input, textarea, dd, dt, h1, h2, h3, h4');
            const small = [];
            for (let el of els) {
                if (el.offsetParent === null && el.tagName !== 'BODY') continue;
                const sz = parseFloat(getComputedStyle(el).fontSize);
                if (sz < 14) {
                    const txt = (el.innerText || '').trim().slice(0,40);
                    if (txt) small.push({tag: el.tagName, text: txt, size: sz,
                        cls: el.className?.toString?.().slice(0,60)});
                    if (small.length >= 12) break;
                }
            }
            return small;
        }""")
        findings["small_fonts_lt14px"] = {
            "status": "WARN" if small_fonts else "PASS",
            "detail": small_fonts,
        }

        # 5. Body / base font
        body_font = page.evaluate("() => parseFloat(getComputedStyle(document.body).fontSize)")
        findings["body_font_size"] = {
            "status": "PASS" if body_font >= 16 else "WARN",
            "detail": f"{body_font}px",
        }

        # 6. Hero / H1 above fold
        h1_info = page.evaluate("""(vpH) => {
            const h1 = document.querySelector('h1');
            if (!h1) return {found: false};
            const rect = h1.getBoundingClientRect();
            const fs = parseFloat(getComputedStyle(h1).fontSize);
            return {found: true, top: Math.round(rect.top), bottom: Math.round(rect.bottom),
                    aboveFold: rect.top < vpH && rect.bottom > 0, fontSize: fs,
                    text: h1.innerText?.slice(0, 60)};
        }""", MOBILE_VP["height"])
        findings["h1_above_fold"] = {
            "status": "PASS" if h1_info.get("aboveFold") else "WARN",
            "detail": h1_info,
        }

        # 7. Images broken
        img_info = page.evaluate("""() => {
            const imgs = document.querySelectorAll('img');
            const broken = [];
            for (let img of imgs) {
                if (!img.complete || img.naturalWidth === 0) {
                    broken.push({src: img.src?.slice(-70), alt: img.alt});
                    if (broken.length >= 6) break;
                }
            }
            // Also check for images wider than viewport
            const overflowing = [];
            for (let img of imgs) {
                const rect = img.getBoundingClientRect();
                if (rect.width > window.innerWidth + 2) {
                    overflowing.push({src: img.src?.slice(-50), w: Math.round(rect.width)});
                    if (overflowing.length >= 4) break;
                }
            }
            return {total: imgs.length, broken, overflowing};
        }""")
        findings["images"] = {
            "status": "FAIL" if img_info["broken"] or img_info["overflowing"] else "PASS",
            "detail": img_info,
        }

        # 8. Hamburger visible
        hamburger = page.locator('button[aria-label="Open menu"]')
        try:
            ham_visible = hamburger.is_visible()
            ham_box = hamburger.bounding_box()
        except Exception:
            ham_visible = False
            ham_box = None
        findings["hamburger"] = {
            "status": "PASS" if ham_visible else "FAIL",
            "detail": {"visible": ham_visible, "box": ham_box},
        }

        # 9. Hero section height
        hero = page.locator("section").first
        try:
            hero_box = hero.bounding_box()
            if hero_box:
                ratio = hero_box["height"] / MOBILE_VP["height"]
                findings["hero_height"] = {
                    "status": "PASS" if ratio >= 0.85 else "WARN",
                    "detail": f"h={round(hero_box['height'])}px ({round(ratio*100)}% of viewport)",
                }
        except Exception as e:
            findings["hero_height"] = {"status": "SKIP", "detail": str(e)}

        # 10. Form field font sizes (iOS auto-zoom risk if < 16px)
        form_fields = page.evaluate("""() => {
            const fields = document.querySelectorAll('input, textarea, select');
            return Array.from(fields).map(f => {
                const r = f.getBoundingClientRect();
                const fs = parseFloat(getComputedStyle(f).fontSize);
                return {type: f.type || f.tagName, name: f.name || f.id || '',
                        h: Math.round(r.height), w: Math.round(r.width), fontSize: fs,
                        iOSZoomRisk: fs < 16};
            });
        }""")
        zoom_risks = [f for f in form_fields if f.get("iOSZoomRisk")]
        findings["form_fields"] = {
            "status": "WARN" if zoom_risks else ("PASS" if form_fields else "SKIP"),
            "detail": {"total": len(form_fields), "zoom_risk_fields": zoom_risks},
        }

        # 11. Buttons / CTAs that are too narrow on mobile
        cta_info = page.evaluate("""() => {
            const btns = Array.from(document.querySelectorAll('a.btn-gold, a.btn-ink, a.btn-light, a.btn-luxe, button[type="submit"]'));
            return btns.map(b => {
                const r = b.getBoundingClientRect();
                return {text: b.innerText?.trim().slice(0,40), w: Math.round(r.width), h: Math.round(r.height)};
            }).slice(0, 10);
        }""")
        narrow_ctas = [c for c in cta_info if c["w"] < 44 or c["h"] < 44]
        findings["cta_sizes"] = {
            "status": "WARN" if narrow_ctas else "PASS",
            "detail": {"all": cta_info, "narrow": narrow_ctas},
        }

        # 12. Text clipping / overflow:hidden truncation on small screens
        text_clip = page.evaluate("""() => {
            const els = document.querySelectorAll('h1, h2, h3, p');
            const clipped = [];
            for (let el of els) {
                const style = getComputedStyle(el);
                if (style.overflow === 'hidden' && style.whiteSpace === 'nowrap') {
                    const txt = el.innerText?.trim().slice(0, 50);
                    if (txt) clipped.push({tag: el.tagName, text: txt, overflow: style.overflow});
                    if (clipped.length >= 6) break;
                }
            }
            return clipped;
        }""")
        findings["text_clipping"] = {
            "status": "WARN" if text_clip else "PASS",
            "detail": text_clip,
        }

        # 13. Sticky/fixed element stacking issues
        fixed_els = page.evaluate("""() => {
            const result = [];
            document.querySelectorAll('*').forEach(el => {
                const s = getComputedStyle(el);
                if (s.position === 'fixed' || s.position === 'sticky') {
                    const r = el.getBoundingClientRect();
                    result.push({tag: el.tagName, cls: el.className?.toString?.().slice(0,60),
                        pos: s.position, z: s.zIndex, top: Math.round(r.top), h: Math.round(r.height)});
                }
            });
            return result.slice(0, 10);
        }""")
        findings["fixed_sticky_elements"] = {
            "status": "INFO",
            "detail": fixed_els,
        }

        # 14. Stat band grid: check if 2-col grid overflows on 390px
        stat_grid = page.evaluate("""() => {
            // Look for the stats section grid
            const grids = Array.from(document.querySelectorAll('[class*="grid"]'));
            const issues = [];
            for (let g of grids) {
                const r = g.getBoundingClientRect();
                if (r.right > window.innerWidth + 2) {
                    issues.push({cls: g.className?.toString?.().slice(0,80), right: Math.round(r.right)});
                    if (issues.length >= 4) break;
                }
            }
            return issues;
        }""")
        findings["grid_overflow"] = {
            "status": "WARN" if stat_grid else "PASS",
            "detail": stat_grid,
        }

        browser.close()
    return findings


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    all_results = {}

    print(f"\n=== Mobile Audit: 390x844 (iPhone 14, dpr:2) ===\n")

    # 1. Per-page screenshots + audits
    for pg in PAGES:
        url = BASE_URL + pg["slug"]
        name = pg["name"]
        ss_path = os.path.join(OUTPUT_DIR, f"mobile_{name}.png")

        print(f"\n--- {pg['slug']} ---")
        capture_page(url, ss_path)
        findings = audit_page(url, name)
        all_results[name] = {"url": url, "screenshot": ss_path, "findings": findings}

    # 2. Mobile nav overlay
    nav_path = os.path.join(OUTPUT_DIR, "mobile_nav_open.png")
    print(f"\n--- NAV OVERLAY ---")
    try:
        capture_nav_open(BASE_URL + "/", nav_path)
        all_results["nav_open"] = {"screenshot": nav_path, "findings": {}}
    except Exception as e:
        print(f"  [nav-open FAILED] {e}")
        all_results["nav_open"] = {"screenshot": None, "findings": {"error": str(e)}}

    # Save JSON
    json_path = os.path.join(OUTPUT_DIR, "mobile_audit.json")
    with open(json_path, "w") as f:
        json.dump(all_results, f, indent=2)
    print(f"\n\nResults saved: {json_path}")
    return all_results


if __name__ == "__main__":
    results = main()

    # Pretty-print summary
    print("\n\n========== AUDIT SUMMARY ==========\n")
    for page, data in results.items():
        if page == "nav_open":
            continue
        findings = data.get("findings", {})
        issues = [(k, v) for k, v in findings.items() if v.get("status") in ("FAIL","WARN")]
        passes = [(k, v) for k, v in findings.items() if v.get("status") == "PASS"]
        print(f"\n[{page.upper()}] {data.get('url','')}")
        print(f"  PASS: {len(passes)} checks")
        if issues:
            print(f"  ISSUES ({len(issues)}):")
            for k, v in issues:
                print(f"    {v['status']} {k}: {json.dumps(v['detail'])[:200]}")
        else:
            print("  No issues found.")
