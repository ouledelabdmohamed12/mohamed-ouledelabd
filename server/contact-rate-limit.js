import { createHash } from 'node:crypto';

// Bounded, per-instance burst control. Turnstile remains mandatory across all
// instances; configure a Vercel WAF rate-limit rule for a global IP quota.
export function createContactRateLimiter({ now = Date.now, limit = 5, windowMs = 600000, maxEntries = 5000 } = {}) {
  const entries = new Map();
  return req => {
    const ip = process.env.VERCEL === '1'
      ? String(req.headers?.['x-vercel-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()
      : req.socket?.remoteAddress || 'unknown';
    const key = createHash('sha256').update(ip).digest('hex');
    const time = now();
    for (const [entryKey, entry] of entries) if (entry.until <= time) entries.delete(entryKey);
    const entry = entries.get(key) || { count: 0, until: time + windowMs };
    if (!entries.has(key) && entries.size >= maxEntries) return { allowed:false, retryAfter:60 };
    entries.set(key, entry);
    entry.count++;
    return { allowed:entry.count <= limit, retryAfter:Math.max(1, Math.ceil((entry.until-time)/1000)) };
  };
}
