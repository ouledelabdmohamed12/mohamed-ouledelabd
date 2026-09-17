/**
 * Single entry point for every analytics and ad-conversion event on the site.
 *
 * No component ever touches `fbq` or `gtag` directly: they call `track()` with
 * one of the EVENTS names below. That keeps the event vocabulary in one place,
 * so what Meta Events Manager and GA4 receive stays consistent, and it means a
 * blocked or disabled tracker can never break a click handler.
 *
 * Three things gate what actually leaves the browser:
 *  1. Consent — nothing is loaded or sent until the visitor accepts (see the
 *     consent banner). A refusal is remembered and honoured.
 *  2. Configuration — VITE_META_PIXEL_ID / VITE_GA4_ID. With neither set, every
 *     function here is a silent no-op, so local development and preview builds
 *     never fire events into a real ad account.
 *  3. Bots — crawlers are never counted as visitors.
 *
 * Note the VITE_ prefix: this is a Vite app and only VITE_-prefixed variables
 * are exposed to client code, so a NEXT_PUBLIC_-prefixed name would silently be
 * undefined. Set both in the Vercel project's environment variables (and in
 * .env locally).
 */

import { isBot } from "./isBot";

export const META_PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID || "").trim();
export const GA4_ID = (import.meta.env.VITE_GA4_ID || "").trim();

type TrackParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[][];
      push?: unknown;
      loaded?: boolean;
      version?: string;
    };
    _fbq?: unknown;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Every event the site sends. `contact`, `lead` and `pageView` are Meta
 * standard events; `devisClick` is a custom one (quote-request intent), which
 * Meta requires to be sent through `trackCustom` instead of `track`.
 */
export const EVENTS = {
  pageView: "PageView",
  contact: "Contact",
  lead: "Lead",
  devisClick: "DevisClick",
  socialClick: "SocialClick",
} as const;

export type TrackEventName = (typeof EVENTS)[keyof typeof EVENTS];

/**
 * Which event a footer social button reports. Email and WhatsApp open a
 * conversation, so they count as Contact; following a profile is interest
 * rather than a contact, and gets its own custom event so it never inflates
 * the conversion the ad campaigns optimise for.
 */
export const SOCIAL_EVENT: Record<string, TrackEventName> = {
  Email: "Contact",
  WhatsApp: "Contact",
};

const META_STANDARD_EVENTS: readonly string[] = [
  EVENTS.pageView,
  EVENTS.contact,
  EVENTS.lead,
];

// ---------------------------------------------------------------------------
// Consent
// ---------------------------------------------------------------------------

const CONSENT_KEY = "koda-consent";

export type ConsentChoice = "granted" | "denied";

/** The stored choice, or null when the visitor has not answered yet. */
export const readConsent = (): ConsentChoice | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    // Private mode / storage blocked: treat as "not answered". The banner
    // reappears, which is the safe direction — no tracking without an answer.
    return null;
  }
};

export const hasConsent = (): boolean => readConsent() === "granted";

/**
 * Records the visitor's choice. Granting starts the trackers immediately and
 * counts the page they are on, since the initial PageView was skipped while
 * consent was still pending.
 */
export const setConsent = (choice: ConsentChoice): void => {
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Choice cannot be persisted; it still holds for this page view.
  }

  if (choice !== "granted") return;

  initAnalytics();
  trackPageView();
};

// ---------------------------------------------------------------------------
// UTM parameters
// ---------------------------------------------------------------------------

const UTM_KEY = "koda-utm";

const UTM_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  // Meta appends this one to ad clicks and it identifies the exact ad.
  "fbclid",
] as const;

/**
 * Remembers the campaign parameters of the landing URL for the rest of the
 * visit, so a contact that happens three pages later can still be traced back
 * to the ad that paid for it.
 *
 * Deliberately NOT gated on consent: this is first-party sessionStorage that
 * is only ever attached to a message the visitor chooses to send us, which is
 * part of handling their own enquiry rather than tracking them. No third party
 * sees it, and it is dropped when the tab closes.
 */
export const captureUtmParams = (): void => {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const found: Record<string, string> = {};

  UTM_FIELDS.forEach((field) => {
    const value = params.get(field);
    if (value) found[field] = value.slice(0, 200);
  });

  // An internal navigation carries no parameters; keep what the landing URL had.
  if (Object.keys(found).length === 0) return;

  try {
    window.sessionStorage.setItem(UTM_KEY, JSON.stringify(found));
  } catch {
    // Storage blocked — attribution is lost, which must never break the page.
  }
};

export const getUtmParams = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  try {
    const stored = window.sessionStorage.getItem(UTM_KEY);
    const parsed = stored ? JSON.parse(stored) : null;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

/**
 * The campaign parameters as one readable line, for the contact email and the
 * prefilled WhatsApp message. Empty when the visit has no campaign origin
 * (direct traffic), so callers can leave the line out entirely.
 */
export const getUtmString = (): string =>
  Object.entries(getUtmParams())
    .map(([key, value]) => `${key}=${value}`)
    .join(" | ");

// ---------------------------------------------------------------------------
// Script loading
// ---------------------------------------------------------------------------

let initialised = false;

const canTrack = (): boolean =>
  typeof window !== "undefined" &&
  !isBot &&
  hasConsent() &&
  Boolean(META_PIXEL_ID || GA4_ID);

/** Runs `task` once the browser is idle, so no tracker delays the first paint. */
const whenIdle = (task: () => void): void => {
  const idle = (window as unknown as {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void;
  }).requestIdleCallback;

  if (typeof idle === "function") idle(task, { timeout: 4000 });
  else window.setTimeout(task, 1200);
};

/**
 * Installs the pixel's queue. Deliberately synchronous, unlike the script tag
 * it feeds: the queue is what holds the landing PageView (and any immediate
 * click) until fbevents.js has finished loading, so deferring this too would
 * silently drop the first events of every visit.
 */
const installMetaQueue = (): void => {
  if (!META_PIXEL_ID || window.fbq) return;

  // The official snippet, rewritten as readable code.
  const fbq: Window["fbq"] = function (...args: unknown[]) {
    fbq!.callMethod
      ? fbq!.callMethod.apply(fbq, args)
      : fbq!.queue!.push(args);
  } as NonNullable<Window["fbq"]>;

  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;

  window.fbq("init", META_PIXEL_ID);
};

/** Same idea for GA4: the dataLayer queue now, the script later. */
const installGa4Queue = (): void => {
  if (!GA4_ID || window.gtag) return;

  window.dataLayer = window.dataLayer || [];
  const gtag: NonNullable<Window["gtag"]> = (...args: unknown[]) => {
    window.dataLayer!.push(args);
  };
  window.gtag = gtag;

  gtag("js", new Date());
  // This is an SPA, so the automatic page_view is switched off: route changes
  // are reported by trackPageView() instead, and leaving it on would count the
  // landing page twice.
  gtag("config", GA4_ID, { send_page_view: false });
};

/** The two third-party scripts, which is the part worth keeping off the
 *  critical path — both drain the queues installed above once they load. */
const injectScripts = (): void => {
  const add = (src: string) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  };

  if (META_PIXEL_ID) add("https://connect.facebook.net/en_US/fbevents.js");
  if (GA4_ID) add(`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`);
};

/**
 * Injects the configured trackers. Idempotent and safe to call on every route
 * change or right after consent is granted.
 */
export const initAnalytics = (): void => {
  if (initialised || !canTrack()) return;
  initialised = true;

  try {
    installMetaQueue();
    installGa4Queue();
  } catch {
    // A tracker that cannot even be queued is simply not used.
    return;
  }

  whenIdle(() => {
    try {
      injectScripts();
    } catch {
      // A blocked script must never surface as a broken page.
    }
  });
};

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

// `undefined` values would reach Meta as the literal string "undefined".
const clean = (params: TrackParams): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
  ) as Record<string, string | number | boolean>;

/**
 * Sends one event to every configured tracker.
 *
 * Safe to call unconditionally from anywhere: it returns silently when consent
 * is missing, when no tracker is configured, or when a script was blocked.
 */
export const track = (name: TrackEventName | string, params: TrackParams = {}): void => {
  if (!canTrack()) return;

  const payload = clean(params);

  try {
    if (typeof window.fbq === "function") {
      const method = META_STANDARD_EVENTS.includes(name) ? "track" : "trackCustom";
      window.fbq(method, name, payload);
    }
  } catch {
    // Ignored on purpose — see the module comment.
  }

  try {
    if (typeof window.gtag === "function") {
      // GA4 event names are snake_case by convention, unlike Meta's PascalCase.
      const ga4Name = name === EVENTS.pageView ? "page_view" : toSnakeCase(name);
      window.gtag("event", ga4Name, payload);
    }
  } catch {
    // Ignored on purpose.
  }
};

const toSnakeCase = (value: string): string =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();

// The last page reported, so the same one is never counted twice in a row.
// React's StrictMode runs effects twice in development, and granting consent
// reports the current page on top of the route effect — both would otherwise
// show up as two visits to one page.
let lastPageView = "";

/**
 * Reports a page view. Needed on every route change because this is an SPA:
 * the trackers only see the very first document load by themselves.
 */
export const trackPageView = (path?: string): void => {
  if (!canTrack()) return;

  const page = path || `${window.location.pathname}${window.location.search}`;
  if (page === lastPageView) return;
  lastPageView = page;

  track(EVENTS.pageView, { page_path: page, page_location: window.location.href });
};
