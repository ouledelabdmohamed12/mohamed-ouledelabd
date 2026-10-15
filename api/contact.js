import { createHmac, randomUUID } from 'node:crypto';
import { buildContactEmails, DEFAULT_INBOX } from '../server/contact-emails.js';
import { createContactRateLimiter } from '../server/contact-rate-limit.js';

const EMAIL_REGEX = /^[^\s@<>"(),;:\\[\]]+@[^\s@<>"(),;:\\[\]]+\.[^\s@<>"(),;:\\[\]]+$/;
const LIMITS = { name:200, email:254, message:10000, phone:80, website:2048, projectType:200, budget:200, language:20, utm:2048, kd_ref_field:200, captchaToken:2048 };

// The transport can be replaced by tests; production only calls real HTTPS APIs.
export function createContactHandler({ env = process.env, transport = globalThis.fetch, logger = console, rateLimit = createContactRateLimiter() } = {}) {
  return async function handler(req, res) {
    const requestId=randomUUID(), start=Date.now();
    res.setHeader('Cache-Control','no-store');
    res.setHeader('X-Request-Id',requestId);
    const reply=(status,code,error)=>res.status(status).json({success:false,code,error,requestId});
    const log=(event,details={})=>logger.info(JSON.stringify({event,requestId,durationMs:Date.now()-start,...details}));
    if(req.method !== 'POST') {
      res.setHeader('Allow','POST');
      return reply(405,'METHOD_NOT_ALLOWED','Méthode non autorisée.');
    }
    const quota=rateLimit(req);
    if(!quota.allowed) {
      res.setHeader('Retry-After',String(quota.retryAfter));
      log('contact_rate_limited');
      return reply(429,'RATE_LIMITED','Trop de tentatives. Veuillez patienter avant de réessayer.');
    }
    if(!/^application\/json(?:\s*;|$)/i.test(req.headers?.['content-type'] || '')) return reply(415,'INVALID_CONTENT_TYPE','Format de requête invalide.');
    let body=req.body;
    try { if(typeof body === 'string') body=JSON.parse(body); } catch { return reply(400,'INVALID_FIELDS','Données invalides.'); }
    if(!body || typeof body !== 'object' || Array.isArray(body)) return reply(400,'INVALID_FIELDS','Données invalides.');
    const data={};
    for(const [key,limit] of Object.entries(LIMITS)) {
      if(body[key] != null && (typeof body[key] !== 'string' || body[key].length>limit)) return reply(400,'INVALID_FIELDS','Un champ est invalide ou trop long.');
      data[key]=(body[key] || '').trim();
      if([...data[key]].some(char => { const code=char.charCodeAt(0); return (code<32 && ![9,10,13].includes(code)) || code===127; })) return reply(400,'INVALID_FIELDS','Un champ contient des caractères invalides.');
    }
    if(data.kd_ref_field) {
      log('contact_rejected',{reason:'honeypot'});
      return reply(400,'INVALID_FIELDS','Veuillez laisser le champ masqué vide.');
    }
    if(!data.name || !data.message || !EMAIL_REGEX.test(data.email) || /[\r\n]/.test(data.name)) return reply(400,'INVALID_FIELDS','Veuillez vérifier votre nom, votre email et votre message.');
    if(!data.captchaToken) return reply(400,'CAPTCHA_FAILED','Veuillez valider la vérification de sécurité.');
    const inbox=env.CONTACT_NOTIFICATION_EMAIL?.trim() || DEFAULT_INBOX;
    if(!env.RESEND_API_KEY?.trim() || !env.TURNSTILE_SECRET_KEY?.trim() || !EMAIL_REGEX.test(inbox)) {
      log('contact_configuration_missing',{resendKeyPresent:!!env.RESEND_API_KEY?.trim(),captchaSecretPresent:!!env.TURNSTILE_SECRET_KEY?.trim(),inboxValid:EMAIL_REGEX.test(inbox)});
      return reply(503,'SERVICE_UNAVAILABLE','Le service est temporairement indisponible. Vos champs sont conservés.');
    }
    let stage='captcha';
    try {
      const verification=await transport('https://challenges.cloudflare.com/turnstile/v0/siteverify',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({secret:env.TURNSTILE_SECRET_KEY,response:data.captchaToken}),signal:AbortSignal.timeout(5000),
      });
      if(!verification.ok) throw Object.assign(new Error('upstream'),{upstreamStatus:verification.status});
      const captcha=await verification.json();
      const hosts=(env.TURNSTILE_ALLOWED_HOSTNAMES || 'kodaatlas.com,www.kodaatlas.com').split(',').map(h=>h.trim());
      if(captcha.success !== true || !hosts.includes(captcha.hostname)) {
        log('contact_captcha_rejected');
        return reply(400,'CAPTCHA_FAILED','La vérification de sécurité a expiré. Veuillez la renouveler.');
      }
      stage='email';
      const emails=buildContactEmails(data,inbox);
      const payload=JSON.stringify(emails);
      // Stable for identical content across retries/instances. No token, time or
      // requestId enters the payload. Resend keeps these keys for 24 hours.
      const key='contact-v1/'+createHmac('sha256',env.RESEND_API_KEY.trim()).update(payload).digest('hex');
      const sent=await transport('https://api.resend.com/emails/batch',{
        method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${env.RESEND_API_KEY.trim()}`,'Idempotency-Key':key},
        body:payload,signal:AbortSignal.timeout(12000),
      });
      let acknowledgment=null;
      try { acknowledgment=await sent.json(); } catch { /* Unexpected body never counts as success. */ }
      const ids=acknowledgment?.data?.map?.(item=>item?.id);
      if(!sent.ok || !Array.isArray(ids) || ids.length!==2 || !ids.every(id=>typeof id==='string' && id.length>0) || new Set(ids).size!==2 || acknowledgment?.errors?.length) {
        log('contact_email_rejected',{provider:'resend',upstreamStatus:sent.status,acceptedCount:Array.isArray(ids)?ids.filter(Boolean).length:0});
        return reply(502,'EMAIL_FAILED','Les deux envois n’ont pas pu être confirmés. Vos champs sont conservés.');
      }
      log('contact_emails_accepted',{provider:'resend',emailCount:2,emailIds:ids});
      return res.status(200).json({success:true,requestId});
    } catch(error) {
      const timeout=error?.name==='TimeoutError' || error?.name==='AbortError';
      log('contact_upstream_failed',{provider:'resend',stage,reason:timeout?'timeout':'network_or_response',upstreamStatus:error?.upstreamStatus});
      return reply(timeout?504:502,stage==='email'?'DELIVERY_UNKNOWN':'SERVICE_UNAVAILABLE',stage==='email'
        ? 'L’envoi n’a pas pu être confirmé. Vos champs sont conservés. Une nouvelle tentative identique sera dédupliquée pendant 24 heures.'
        : 'Le service est temporairement indisponible. Veuillez réessayer plus tard.');
    }
  };
}
export default createContactHandler();
