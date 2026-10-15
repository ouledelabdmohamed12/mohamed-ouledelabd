import test from 'node:test';
import assert from 'node:assert/strict';
import { createContactHandler } from '../api/contact.js';
import { buildContactEmails, escapeHtml, FROM } from '../server/contact-emails.js';
import { createContactRateLimiter } from '../server/contact-rate-limit.js';
const env={RESEND_API_KEY:'private-resend-test',TURNSTILE_SECRET_KEY:'private-captcha-test'};
const valid={name:'Client Test',email:'client@example.com',message:'Bonjour\nVoici mon projet.',captchaToken:'token',phone:'+212600000000',website:'https://example.com',projectType:'Site vitrine',budget:'20 000 MAD',language:'fr',utm:'utm_source=instagram'};
const accepted={data:[{id:'internal-email-id'},{id:'reply-email-id'}]};
function response(){return {headers:{},setHeader(k,v){this.headers[k]=v;},status(s){this.statusCode=s;return this;},json(v){this.body=v;return this;}};}
async function run({body=valid,method='POST',config=env,captcha={success:true,hostname:'kodaatlas.com'},status=200,payload=accepted,failAt,malformed=false,rateLimit=()=>({allowed:true}),headers={'content-type':'application/json'}}={}) {
 const calls=[],logs=[];
 const transport=async(url,options)=>{calls.push({url,options});if(failAt && url.includes(failAt))throw new DOMException('private response diagnostic','TimeoutError');return url.includes('siteverify')?{ok:true,json:async()=>captcha}:{ok:status>=200&&status<300,status,json:async()=>{if(malformed)throw new Error('not JSON');return payload;}};};
 const res=response();await createContactHandler({env:config,transport,rateLimit,logger:{info:s=>logs.push(s)}})({method,body,headers,socket:{remoteAddress:'127.0.0.1'}},res);return {res,calls,logs};
}
test('two Resend payloads; exact envelopes, subjects, reply-to and all dynamic fields',async()=>{
 const {res,calls,logs}=await run();assert.equal(res.statusCode,200);assert.equal(res.body.success,true);assert.equal(calls.length,2);assert.equal(calls[1].url,'https://api.resend.com/emails/batch');assert.equal(calls[1].options.headers.Authorization,`Bearer ${env.RESEND_API_KEY}`);
 const [internal,reply]=JSON.parse(calls[1].options.body);assert.equal(internal.from,FROM);assert.equal(reply.from,FROM);assert.deepEqual(internal.to,['contact@kodaatlas.com']);assert.deepEqual(reply.to,[valid.email]);assert.equal(internal.reply_to,valid.email);assert.equal(reply.reply_to,'contact@kodaatlas.com');assert.equal(internal.subject,'[Koda Atlas] Nouveau message de Client Test');assert.equal(reply.subject,'Merci de nous avoir contactés !');
 for(const key of ['name','email','phone','website','projectType','budget','language','utm'])assert(internal.html.includes(escapeHtml(valid[key])));
 assert(reply.html.includes('Bonjour Client Test,'));assert(reply.html.includes('href="https://kodaatlas.com"'));assert(reply.html.includes(valid.budget));assert(internal.text.includes(valid.message));assert(reply.text.includes(valid.message));
 const logged=logs.join('');for(const value of [valid.email,valid.name,valid.phone,valid.message,env.RESEND_API_KEY,env.TURNSTILE_SECRET_KEY])assert(!logged.includes(value));assert(logged.includes('contact_emails_accepted'));
});
for(const body of [null,[], '{',{...valid,name:' '},{...valid,email:'invalid'},{...valid,email:'x@example.com\r\nBcc: x@evil.test'},{...valid,name:'Name\nBcc: x'},{...valid,name:'a\u0000b'},{...valid,message:[]},{...valid,message:'x'.repeat(10001)},{...valid,kd_ref_field:'bot'},{...valid,captchaToken:''}])test(`reject invalid payload ${JSON.stringify(body).slice(0,60)}`,async()=>{const {res,calls}=await run({body});assert.equal(res.statusCode,400);assert.equal(res.body.success,false);assert.equal(calls.length,0);});
test('JSON type and POST required',async()=>{for(const [options,status] of [[{method:'GET'},405],[{headers:{}},415],[{headers:{'content-type':'application/jsonx'}},415]])assert.equal((await run(options)).res.statusCode,status);});
test('configuration errors fail closed before provider call',async()=>{for(const config of [{},{RESEND_API_KEY:'x'},{...env,CONTACT_NOTIFICATION_EMAIL:'bad'}]){const {res,calls}=await run({config});assert.equal(res.statusCode,503);assert.equal(calls.length,0);}});
test('server-only alternate inbox controls notification and reply-to',async()=>{const {calls}=await run({config:{...env,CONTACT_NOTIFICATION_EMAIL:'verified@example.org'}});const emails=JSON.parse(calls[1].options.body);assert.deepEqual(emails[0].to,['verified@example.org']);assert.equal(emails[1].reply_to,'verified@example.org');});
for(const captcha of [{success:false},{success:true,hostname:'attacker.test'}])test('captcha blocks all email sends',async()=>{const {res,calls}=await run({captcha});assert.equal(res.statusCode,400);assert.equal(calls.length,1);});
for(const status of [400,401,403,409,422,429,500])test(`Resend ${status} never succeeds or falls back to EmailJS`,async()=>{const {res,calls}=await run({status,payload:{name:'validation_error',message:'secret provider diagnostic'}});assert.equal(res.statusCode,502);assert.equal(res.body.success,false);assert.equal(calls.length,2);assert(!JSON.stringify(res.body).includes('secret provider diagnostic'));});
for(const payload of [{},{data:[]},{data:[{id:'only-one'}]},{data:[{id:''},{id:'other'}]},{data:[{id:'same'},{id:'same'}]},{...accepted,errors:[{message:'partial failure'}]}])test('both provider IDs required, including partial errors',async()=>{assert.equal((await run({payload})).res.statusCode,502);});
test('non-JSON response is never success',async()=>{assert.equal((await run({malformed:true})).res.statusCode,502);});
test('timeouts at verification and email stages; no automatic fallback',async()=>{const captcha=await run({failAt:'siteverify'});assert.equal(captcha.res.statusCode,504);assert.equal(captcha.calls.length,1);const mail=await run({failAt:'resend.com'});assert.equal(mail.res.body.code,'DELIVERY_UNKNOWN');assert.equal(mail.calls.length,2);});
test('idempotency stable across fresh handler instances and renewed CAPTCHA',async()=>{const a=await run();const b=await run({body:{...valid,captchaToken:'renewed'}});assert.equal(a.calls[1].options.headers['Idempotency-Key'],b.calls[1].options.headers['Idempotency-Key']);assert.equal(a.calls[1].options.body,b.calls[1].options.body);assert(!a.calls[1].options.headers['Idempotency-Key'].includes(valid.email));const c=await run({body:{...valid,message:'Changed enquiry'}});assert.notEqual(a.calls[1].options.headers['Idempotency-Key'],c.calls[1].options.headers['Idempotency-Key']);});
test('rate limit returns 429 and Retry-After without sending',async()=>{const {res,calls}=await run({rateLimit:()=>({allowed:false,retryAfter:60})});assert.equal(res.statusCode,429);assert.equal(res.headers['Retry-After'],'60');assert.equal(calls.length,0);});
test('per-instance quota expires, separates IPs and bounds memory',()=>{let time=0;const limit=createContactRateLimiter({now:()=>time,limit:2,windowMs:1000,maxEntries:2});const req=ip=>({socket:{remoteAddress:ip}});assert(limit(req('a')).allowed);assert(limit(req('a')).allowed);assert(!limit(req('a')).allowed);assert(limit(req('b')).allowed);assert(!limit(req('c')).allowed);time=1001;assert(limit(req('a')).allowed);});
test('HTML injection escaped in every template; untrusted website is never a link',()=>{const attack='<img src=x onerror="alert(1)"> & \'test\'';const emails=buildContactEmails({...valid,name:attack,message:attack,website:'javascript:alert(1)',budget:attack});for(const email of emails){assert(!email.html.includes(attack));assert(!email.html.includes('<img src=x'));assert(email.html.includes('&lt;img'));assert(!email.html.includes('href="javascript:'));assert(email.text.includes(attack));}});
test('optional blanks are readable and templates have text fallbacks',()=>{const emails=buildContactEmails({name:'N',email:'n@example.org',message:'M'});assert(emails.every(email=>email.html.includes('Non précisé')&&email.text.includes('Non précisé')));});
test('retry after lost Resend response reuses the batch and does not duplicate either email',async()=>{
 const store=new Map();let physicalEmails=0,first=true;
 const transport=async(url,options)=>{
  if(url.includes('siteverify'))return {ok:true,json:async()=>({success:true,hostname:'kodaatlas.com'})};
  const key=options.headers['Idempotency-Key'];
  if(!store.has(key)){store.set(key,accepted);physicalEmails+=JSON.parse(options.body).length;}
  if(first){first=false;throw new DOMException('response lost after acceptance','TimeoutError');}
  return {ok:true,status:200,json:async()=>store.get(key)};
 };
 const make=()=>createContactHandler({env,transport,rateLimit:()=>({allowed:true}),logger:{info(){}}});
 const a=response();await make()({method:'POST',headers:{'content-type':'application/json'},body:valid},a);assert.equal(a.body.code,'DELIVERY_UNKNOWN');
 const b=response();await make()({method:'POST',headers:{'content-type':'application/json'},body:{...valid,captchaToken:'new-token'}},b);assert.equal(b.body.success,true);assert.equal(physicalEmails,2);assert.equal(store.size,1);
});
import { replyMailtoHref, safeWebsiteHref } from '../server/contact-emails.js';
test('attribute and URL helpers encode addresses and subjects without allowing active schemes',()=>{
 const href=replyMailtoHref('a+b@example.com','Réponse " ><img src=x> & budget');
 assert(href.startsWith('mailto:a%2Bb@example.com?subject='));assert(!href.includes('<'));assert(!href.includes('"'));assert(href.includes('%26'));
 for(const input of ['javascript:alert(1)','data:text/html,x','https://user:pass@example.com','not a URL'])assert.equal(safeWebsiteHref(input),'');
 assert.equal(safeWebsiteHref('https://example.com/?a=1&b=2'),'https://example.com/?a=1&amp;b=2');
 assert.equal(escapeHtml(undefined),'');assert.equal(escapeHtml(null),'');
});

test('original templates preserve brand image, palette, reply button and original CTA',()=>{
 const [notification,reply]=buildContactEmails(valid);
 for(const email of [notification,reply]){assert(email.html.includes('https://kodaatlas.com/og-image.png'));assert(email.html.includes('#eef1f3'));assert(email.html.includes('#2596a8'));assert(!email.html.includes('apple-touch-icon'));assert(!email.html.includes('{{'));}
 assert(notification.html.includes('Répondre à Client Test'));assert(notification.html.includes('subject=Votre%20demande%20Koda%20Atlas'));
 assert(reply.html.includes('Récapitulatif de votre demande'));assert(reply.html.includes('Web, Mobile &amp; E-commerce Development'));assert(reply.html.includes('href="https://kodaatlas.com"'));
});
test('original href contexts encode emails and allow only safe optional links',()=>{
 const [email]=buildContactEmails({...valid,email:'a+b?tag@example.com',website:'https://example.com/?x=1&y="test"',phone:'+212 600 000 000'});
 assert(email.html.includes('mailto:a%2Bb%3Ftag@example.com'));assert(email.html.includes('tel:%2B212600000000'));assert(email.html.includes('href="https://example.com/?x=1&amp;y=%22test%22"'));
 const [bad]=buildContactEmails({...valid,phone:'javascript:alert(1)',website:'javascript:alert(1)'});
 assert(!bad.html.includes('href="javascript:'));assert(!bad.html.includes('href="tel:'));assert(bad.html.includes('<span style="color:#1d7f90; text-decoration:none;">javascript:alert(1)</span>'));
 const [blank]=buildContactEmails({name:'N',email:'n@example.com',message:'M'});assert(!blank.html.includes('href=""'));assert(!blank.html.includes('href="tel:'));assert(!blank.html.includes('undefined'));assert(!blank.html.includes('null'));
});
