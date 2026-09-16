/**
 * Reproduces what Googlebot actually sees, so the "only the header renders"
 * regression in Search Console can be checked locally instead of by waiting a
 * week for a re-crawl.
 *
 * It mimics the two behaviours that broke the render:
 *   1. Googlebot Smartphone's user agent  -> `isBot` is true, entrance
 *      animations are skipped.
 *   2. The viewport is resized to the FULL document height before the
 *      screenshot, which is why an uncapped `100vh` section used to stretch to
 *      ~10 000px and push the hero headline off-screen.
 *
 * Then it fails if any heading/paragraph is still effectively invisible
 * (opacity multiplied down the ancestor chain, the way the compositor does it)
 * or if the hero H1 does not land inside the first 1000px.
 *
 * Usage:
 *   npm run build
 *   node scripts/seo-render-check.mjs            # boots `vite preview` itself
 *   node scripts/seo-render-check.mjs https://kodaatlas.com   # or hit a URL
 */
import { chromium, devices } from "playwright";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

const ROUTES = ["/", "/services", "/work", "/about", "/contact", "/terms", "/privacy"];
const OUT_DIR = path.resolve("scripts/.seo-shots");

// Googlebot Smartphone, verbatim from Google's crawler documentation.
const GOOGLEBOT_UA =
  "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/141.0.7390.76 Mobile Safari/537.36 " +
  "(compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

const VIEWPORT = { width: 412, height: 732 };
// Googlebot's own render cap. Also keeps Chromium from refusing a resize.
const MAX_RENDER_HEIGHT = 15000;
const HERO_FOLD = 1000;

/** Starts `vite preview` and resolves once it is serving. */
async function startPreview() {
  // Vite's own entry point rather than `npm run preview`: going through npm
  // (and, on Windows, a shell wrapper) leaves the real server as a grandchild
  // that `child.kill()` cannot reach, so a failed run would keep holding the
  // strict port and every later run would time out.
  const child = spawn(
    process.execPath,
    [
      path.resolve("node_modules/vite/bin/vite.js"),
      "preview",
      "--port",
      "4173",
      "--strictPort",
    ],
    { stdio: ["ignore", "pipe", "pipe"] }
  );

  const url = await new Promise((resolve, reject) => {
    const fail = (err) => {
      child.kill(); // never leave a zombie holding the strict port
      reject(err);
    };
    const timer = setTimeout(
      () => fail(new Error("vite preview did not start in 30s")),
      30000
    );
    const onData = (buf) => {
      // Vite colourises its banner, and the escape codes land *inside*
      // "localhost:<port>", so strip them before matching the URL.
      const text = buf.toString().replace(/\[[0-9;]*m/g, "");
      process.stdout.write(text.includes("Local") ? text : "");
      const match = text.match(/https?:\/\/localhost:\d+/);
      if (match) {
        clearTimeout(timer);
        resolve(match[0]);
      }
    };
    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.on("error", fail);
  });

  return { url, stop: () => child.kill() };
}

/**
 * Effective opacity of an element = its own opacity times every ancestor's.
 * A single `opacity: 0` anywhere up the chain hides the subtree, which is
 * exactly how a not-yet-triggered Framer Motion container hid whole sections.
 * `display: none` / `visibility: hidden` count as invisible too.
 */
const COLLECT_INVISIBLE = () => {
  const results = [];
  for (const el of document.querySelectorAll("h1, h2, h3, p")) {
    const text = (el.textContent || "").trim();
    if (!text) continue;

    let opacity = 1;
    let hidden = false;
    for (let node = el; node && node !== document.documentElement; node = node.parentElement) {
      const cs = getComputedStyle(node);
      if (cs.display === "none" || cs.visibility === "hidden") { hidden = true; break; }
      opacity *= parseFloat(cs.opacity);
    }

    const rect = el.getBoundingClientRect();
    results.push({
      tag: el.tagName,
      text: text.slice(0, 70),
      opacity: Number(opacity.toFixed(3)),
      hidden,
      // Absolute document position, independent of the current scroll offset.
      top: Math.round(rect.top + window.scrollY),
    });
  }
  return results;
};

let server = null;

/**
 * The document's heading outline, in DOM order. Checked for exactly one <h1>
 * and for skipped levels (an <h3> directly under an <h1>, say) — the two
 * things that make a page's structure unreadable to a crawler.
 */
const COLLECT_OUTLINE = () =>
  [...document.querySelectorAll("#root h1, #root h2, #root h3, #root h4, #root h5, #root h6")]
    .filter((el) => (el.textContent || "").trim())
    .map((el) => ({
      level: Number(el.tagName[1]),
      text: (el.textContent || "").trim().slice(0, 50),
    }));

const run = async () => {
  const target = process.argv[2];
  server = target ? null : await startPreview();
  const base = target ?? server.url;

  mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices["Pixel 5"],
    userAgent: GOOGLEBOT_UA,
    viewport: VIEWPORT,
    // Googlebot renders with JS on but never scrolls and never moves a pointer.
    hasTouch: true,
    isMobile: true,
  });

  let failures = 0;

  for (const route of ROUTES) {
    const page = await context.newPage();
    // Not `networkidle`: the Turnstile widget and the Meta pixel keep
    // long-lived connections open, so the network never goes quiet. Waiting on
    // the app's own first heading is both faster and a truer signal that React
    // has painted.
    await page.goto(base + route, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("#root h1, #root h2", { timeout: 15000 });

    // Full document height, then resize the window to it — the step that made
    // the old `min-h-screen` hero collapse off-screen.
    const fullHeight = await page.evaluate(() =>
      Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
    );
    await page.setViewportSize({
      width: VIEWPORT.width,
      height: Math.min(fullHeight, MAX_RENDER_HEIGHT),
    });
    // One frame for layout to settle after the resize. Deliberately no scroll.
    await page.waitForTimeout(500);

    const name = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
    await page.screenshot({ path: path.join(OUT_DIR, `${name}.png`), fullPage: true });

    const nodes = await page.evaluate(COLLECT_INVISIBLE);
    const invisible = nodes.filter((n) => n.hidden || n.opacity === 0);

    console.log(`\n${route}  (document height ${fullHeight}px, ${nodes.length} text nodes)`);
    if (invisible.length) {
      failures++;
      console.log(`  FAIL  ${invisible.length} invisible text node(s):`);
      for (const n of invisible.slice(0, 12)) {
        console.log(`        <${n.tag}> opacity=${n.hidden ? "hidden" : n.opacity}  "${n.text}"`);
      }
    } else {
      console.log(`  ok    0 invisible of ${nodes.length}`);
    }

    // The lead headline has to sit inside the crawler's first screenful — the
    // symptom that started all this: a full-viewport hero stretched to the
    // whole document height centred its heading around the 5 000th pixel.
    const h1 = nodes.find((n) => n.tag === "H1");
    const lead = h1 ?? nodes.find((n) => n.tag === "H2");

    if (!lead) {
      failures++;
      console.log("  FAIL  no heading on this route");
    } else if (lead.top > HERO_FOLD) {
      failures++;
      console.log(`  FAIL  <${lead.tag}> sits at ${lead.top}px, past the ${HERO_FOLD}px fold — "${lead.text}"`);
    } else {
      console.log(`  ok    <${lead.tag}> at ${lead.top}px — "${lead.text}"`);
    }

    // Document outline: exactly one <h1>, and no skipped levels under it.
    const outline = await page.evaluate(COLLECT_OUTLINE);
    const h1s = outline.filter((n) => n.level === 1);

    if (h1s.length === 1) {
      console.log(`  ok    exactly one <h1> — "${h1s[0].text}"`);
    } else {
      failures++;
      console.log(`  FAIL  ${h1s.length} <h1> on this route (expected exactly 1)`);
    }

    const skips = [];
    for (let i = 1; i < outline.length; i++) {
      // Going back up the tree is always fine; only a jump *down* of more than
      // one level breaks the outline.
      if (outline[i].level - outline[i - 1].level > 1) {
        skips.push(`h${outline[i - 1].level} -> h${outline[i].level} at "${outline[i].text}"`);
      }
    }
    if (skips.length) {
      failures++;
      console.log(`  FAIL  ${skips.length} skipped heading level(s):`);
      for (const skip of skips) console.log(`        ${skip}`);
    } else {
      console.log(`  ok    no skipped heading levels (${outline.length} headings)`);
    }

    await page.close();
  }

  await browser.close();
  server?.stop();

  console.log(`\nScreenshots: ${OUT_DIR}`);
  if (failures) {
    console.error(`\n${failures} check(s) failed.`);
    process.exit(1);
  }
  console.log("\nAll routes render fully for Googlebot.");
};

run().catch((err) => {
  console.error(err);
  server?.stop();
  process.exit(1);
});
