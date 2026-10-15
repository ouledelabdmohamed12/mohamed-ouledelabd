import { randomUUID } from 'node:crypto';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 200, email: 254, message: 10000, phone: 80, website: 2048, projectType: 200, budget: 200, language: 20, utm: 2048, kd_ref_field: 200, captchaToken: 2048 };

// Injectable transport is for isolated tests only; production always uses real HTTPS.
export function createContactHandler({ env = process.env, transport = globalThis.fetch, logger = console } = {}) {
  return async function handler(req, res) {
    const requestId = randomUUID();
    const start = Date.now();
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Request-Id', requestId);
    const reply = (status, code, error) => res.status(status).json({ success: false, code, error, requestId });
    const log = (event, details = {}) => logger.info(JSON.stringify({ event, requestId, durationMs: Date.now() - start, ...details }));
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return reply(405, 'METHOD_NOT_ALLOWED', 'Méthode non autorisée.');
    }
    if (!req.headers?.['content-type']?.toLowerCase().startsWith('application/json')) return reply(415, 'INVALID_CONTENT_TYPE', 'Format de requête invalide.');
    let body = req.body;
    try { if (typeof body === 'string') body = JSON.parse(body); } catch { return reply(400, 'INVALID_FIELDS', 'Données invalides.'); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return reply(400, 'INVALID_FIELDS', 'Données invalides.');
    const data = {};
    for (const [key, limit] of Object.entries(LIMITS)) {
      if (body[key] != null && (typeof body[key] !== 'string' || body[key].length > limit)) return reply(400, 'INVALID_FIELDS', 'Un champ est invalide ou trop long.');
      data[key] = (body[key] || '').trim();
    }
    if (data.kd_ref_field) {
      log('contact_rejected', { reason: 'honeypot' });
      return reply(400, 'INVALID_FIELDS', 'Veuillez laisser le champ masqué vide.');
    }
    if (!data.name || !data.message || !EMAIL_REGEX.test(data.email)) return reply(400, 'INVALID_FIELDS', 'Veuillez vérifier votre nom, votre email et votre message.');
    if (!data.captchaToken) return reply(400, 'CAPTCHA_FAILED', 'Veuillez valider la vérification de sécurité.');
    if (!env.EMAILJS_PRIVATE_KEY?.trim() || !env.TURNSTILE_SECRET_KEY?.trim()) {
      log('contact_configuration_missing', { emailKeyPresent: !!env.EMAILJS_PRIVATE_KEY?.trim(), captchaSecretPresent: !!env.TURNSTILE_SECRET_KEY?.trim() });
      return reply(503, 'SERVICE_UNAVAILABLE', 'Le service est temporairement indisponible. Votre message est conservé dans le formulaire.');
    }
    let stage = 'captcha';
    try {
      const verification = await transport('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: data.captchaToken }),
        signal: AbortSignal.timeout(5000),
      });
      if (!verification.ok) throw Object.assign(new Error('upstream'), { upstreamStatus: verification.status });
      const captcha = await verification.json();
      const hosts = (env.TURNSTILE_ALLOWED_HOSTNAMES || 'kodaatlas.com,www.kodaatlas.com').split(',').map(h => h.trim());
      if (captcha.success !== true || !hosts.includes(captcha.hostname)) {
        log('contact_captcha_rejected');
        return reply(400, 'CAPTCHA_FAILED', 'La vérification de sécurité a expiré. Veuillez la renouveler.');
      }
      stage = 'email';
      const templateParams = { title: 'Koda Atlas Inquiry' };
      for (const key of Object.keys(LIMITS)) {
        if (key !== 'captchaToken' && key !== 'kd_ref_field') templateParams[key] = data[key] || 'Non précisé';
      }
      // EmailJS REST contract: identical template and credentials to the SDK,
      // with an abortable request rather than the SDK's unbounded HTTPS call.
      const sent = await transport('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: env.EMAILJS_SERVICE_ID || 'service_prx83vw',
          template_id: env.EMAILJS_TEMPLATE_ID || 'template_bbujlih',
          user_id: env.EMAILJS_PUBLIC_KEY || 'SAbE7J_X_PEmfaP8h',
          accessToken: env.EMAILJS_PRIVATE_KEY, template_params: templateParams,
        }), signal: AbortSignal.timeout(12000),
      });
      const acknowledgment = await sent.text();
      if (sent.status !== 200 || acknowledgment.trim() !== 'OK') {
        log('contact_email_rejected', { upstreamStatus: sent.status });
        return reply(502, 'EMAIL_FAILED', "L’envoi a échoué. Vos champs sont conservés ; veuillez réessayer plus tard.");
      }
      log('contact_email_accepted', { upstreamStatus: sent.status });
      return res.status(200).json({ success: true, requestId });
    } catch (error) {
      const timeout = error?.name === 'TimeoutError' || error?.name === 'AbortError';
      log('contact_upstream_failed', { stage, reason: timeout ? 'timeout' : 'network_or_response', upstreamStatus: error?.upstreamStatus });
      return reply(timeout ? 504 : 502, timeout && stage === 'email' ? 'DELIVERY_UNKNOWN' : 'SERVICE_UNAVAILABLE', timeout && stage === 'email'
        ? 'Le service ne confirme pas encore l’envoi. Vos champs sont conservés ; attendez avant de réessayer pour éviter un doublon.'
        : 'Le service est temporairement indisponible. Veuillez réessayer plus tard.');
    }
  };
}

export default createContactHandler();
