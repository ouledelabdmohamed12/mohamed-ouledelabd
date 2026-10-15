// Server-only rendering of the original HTML supplied by the owner.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
export const FROM = 'Koda Atlas <noreply@kodaatlas.com>';
export const DEFAULT_INBOX = 'contact@kodaatlas.com';
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const originals = {
  internal: readFileSync(join(process.cwd(), 'server/templates/contact-us.html'), 'utf8'),
  reply: readFileSync(join(process.cwd(), 'server/templates/auto-reply.html'), 'utf8'),
};
export function replyMailtoHref(email, subject = '') {
  const address = encodeURIComponent(String(email)).replace(/%40/gi, '@');
  return escapeHtml('mailto:' + address + (subject ? '?subject=' + encodeURIComponent(subject) : ''));
}
export function safeWebsiteHref(value) {
  try {
    const url = new URL(String(value));
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return '';
    return escapeHtml(url.href);
  } catch { return ''; }
}
const labelValue = value => typeof value === 'string' && value.trim() ? value.trim() : 'Non précisé';
const fields = [['name','Nom'],['email','E-mail'],['phone','Téléphone'],['website','Site web'],['projectType','Type de projet'],['budget','Budget'],['language','Langue'],['utm','Origine UTM']];

function render(template, data) {
  // Resolve URL contexts FIRST. Text interpolation must never enter an href.
  let html = template.replace('href="mailto:{{email}}?subject=Votre%20demande%20Koda%20Atlas"', `href="${replyMailtoHref(data.email, 'Votre demande Koda Atlas')}"`)
    .replace('href="mailto:{{email}}"', `href="${replyMailtoHref(data.email)}"`);
  const phone = typeof data.phone === 'string' ? data.phone.trim() : '';
  const phoneHref = /^\+?[\d ().-]{3,80}$/.test(phone) ? 'tel:' + encodeURIComponent(phone.replace(/[ ().-]/g, '')) : '';
  for (const [placeholder, href] of [['tel:{{phone}}', phoneHref], ['{{website}}', safeWebsiteHref(data.website)]]) {
    // Keep original label/style; absent or unsafe optional URLs become plain text.
    const escaped = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(new RegExp(`<a href="${escaped}"([^>]*)>([^<]*)</a>`, 'g'), (_match, attributes, text) => href
      ? `<a href="${href}"${attributes}>${text}</a>` : `<span${attributes}>${text}</span>`);
  }
  html = html.replace(/{{\s*(\w+)\s*}}/g, (_match, key) => {
    if (key !== 'message' && !fields.some(([field]) => field === key)) throw new Error('Unknown contact template variable');
    return escapeHtml(labelValue(data[key]));
  });
  return '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>td,p,h1,div,a{overflow-wrap:anywhere;word-break:break-word}</style></head><body style="margin:0">' + html + '</body></html>';
}
export function buildContactEmails(data, inbox = DEFAULT_INBOX) {
  const details = fields.map(([key,label]) => `${label} : ${labelValue(data[key])}`).join('\n');
  return [
    {from:FROM,to:[inbox],reply_to:data.email,subject:`[Koda Atlas] Nouveau message de ${data.name}`,
      html:render(originals.internal,data),text:`Nouvelle demande Koda Atlas\n\n${details}\n\nMessage :\n${data.message}`},
    {from:FROM,to:[data.email],reply_to:inbox,subject:'Merci de nous avoir contactés !',
      html:render(originals.reply,data),text:`Bonjour ${data.name},\n\nMerci d'avoir contacté Koda Atlas. Nous avons bien reçu votre demande.\n\nType de projet : ${labelValue(data.projectType)}\nBudget : ${labelValue(data.budget)}\n\nVotre message :\n${data.message}\n\nDécouvrir nos réalisations : https://kodaatlas.com\n\nL'équipe Koda Atlas\n${inbox}`},
  ];
}
