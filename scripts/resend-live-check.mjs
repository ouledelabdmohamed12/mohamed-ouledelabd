// Operator-only smoke test. No network request without --send and explicit client.
import { existsSync } from 'node:fs';
import { createHmac } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { buildContactEmails } from '../server/contact-emails.js';
if(existsSync('.env')) process.loadEnvFile('.env');
const args=process.argv.slice(2);
let client=args.find(value=>value.startsWith('--client-email='))?.slice('--client-email='.length);
if(args.includes('--check')) {
 const resendKeyConfigured=!!process.env.RESEND_API_KEY?.trim();
 const turnstileSecretConfigured=!!process.env.TURNSTILE_SECRET_KEY?.trim();
 const siteKeyConfigured=!!process.env.VITE_TURNSTILE_SITE_KEY?.trim();
 console.log(JSON.stringify({resendKeyConfigured,turnstileSecretConfigured,siteKeyConfigured,notificationInbox:process.env.CONTACT_NOTIFICATION_EMAIL?.trim()||'contact@kodaatlas.com',readyForForm:resendKeyConfigured&&turnstileSecretConfigured&&siteKeyConfigured,networkRequestMade:false}));
 process.exit(resendKeyConfigured&&turnstileSecretConfigured&&siteKeyConfigured?0:1);
}
if(!args.includes('--send')) {
 console.log('Aucun email envoyé. Vérification locale : npm run email:test:live -- --check. Envoi réel avec saisie de l’adresse de test : npm run email:test:live -- --send.');
 process.exit(0);
}
const key=process.env.RESEND_API_KEY?.trim();
if(!key) throw new Error('RESEND_API_KEY must be configured server-side before a live test. Do not paste it into chat.');
if(!client) {
 if(!process.stdin.isTTY) throw new Error('Renseignez une adresse contrôlée avec --client-email=... ou lancez ce test depuis votre terminal interactif.');
 const prompt=createInterface({input:process.stdin,output:process.stdout});
 try { client=(await prompt.question('Adresse Gmail personnelle pour recevoir l’Auto-Reply : ')).trim(); }
 finally { prompt.close(); }
}
if(!client || !/^[^\s@<>"(),;:]+@[^\s@<>"(),;:]+\.[^\s@<>"(),;:]+$/.test(client)) throw new Error('Provide --client-email with a controlled, valid test inbox.');
const inbox=process.env.CONTACT_NOTIFICATION_EMAIL?.trim() || 'contact@kodaatlas.com';
if(!/^[^\s@<>"(),;:]+@[^\s@<>"(),;:]+\.[^\s@<>"(),;:]+$/.test(inbox)) throw new Error('Invalid notification inbox configuration.');
const emails=buildContactEmails({name:'TEST Resend Koda Atlas',email:client,message:'TEST technique : vérifier la réception des deux emails, les accents et les retours à la ligne.\nMerci de vérifier également le Reply-To.',projectType:'Site vitrine (test)',budget:'Non précisé',language:'fr',utm:'test=smoke'},inbox);
const payload=JSON.stringify(emails);
const idempotencyKey='contact-v1/'+createHmac('sha256',key).update(payload).digest('hex');
const redact=value=>typeof value==='string'?value.split(key).join('[redacted]').replace(/re_[A-Za-z0-9_-]+/g,'[redacted]').slice(0,700):undefined;
let response;
try {
response=await fetch('https://api.resend.com/emails/batch',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${key}`,'Idempotency-Key':idempotencyKey},body:payload,signal:AbortSignal.timeout(12000)});
} catch(error) {
 console.error(JSON.stringify({event:'live_test_connection_failed',errorType:redact(error?.name),networkCode:redact(error?.cause?.code),deliveryState:'unknown',retryPerformed:false}));
 process.exit(1);
}
const result=await response.json().catch(()=>null);
const ids=Array.isArray(result?.data)?result.data.map(item=>item?.id):[];
if(!response.ok || ids.length!==2 || ids.some(id=>typeof id!=='string'||!id) || new Set(ids).size!==2 || result?.errors?.length) {
 console.error(JSON.stringify({event:'live_test_not_confirmed',status:response.status,acceptedCount:ids.filter(Boolean).length,providerError:redact(result?.name),providerMessage:redact(result?.message),retryPerformed:false}));
 process.exitCode=1;
} else {
 console.log(JSON.stringify({event:'live_test_accepted',status:response.status,emailIds:ids,emailCount:2}));
 console.log('Resend acceptance only. Confirm both inboxes and delivery events manually; this does not prove delivery. Identical retries are deduplicated for 24 hours.');
}
