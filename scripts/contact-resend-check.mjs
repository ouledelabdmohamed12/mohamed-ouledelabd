import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { preview } from 'vite';
import { chromium } from 'playwright';
import { createContactHandler } from '../api/contact.js';
let mode='fail',mailCount=0,requests=0;
const deliveries=new Map(),logs=[];
const handler=createContactHandler({env:{RESEND_API_KEY:'integration-test-secret',TURNSTILE_SECRET_KEY:'test-captcha-secret'},logger:{info:line=>logs.push(JSON.parse(line))},rateLimit:()=>({allowed:true}),transport:async(url,options)=>{
 if(url.includes('siteverify')) return {ok:true,json:async()=>({success:true,hostname:'kodaatlas.com'})};
 assert.equal(url,'https://api.resend.com/emails/batch');
 if(mode==='fail') return {ok:false,status:503,json:async()=>({name:'application_error'})};
 const key=options.headers['Idempotency-Key'];
 if(!deliveries.has(key)) {const emails=JSON.parse(options.body);assert.equal(emails.length,2);assert.equal(emails[0].to[0],'contact@kodaatlas.com');assert.equal(emails[1].reply_to,'contact@kodaatlas.com');mailCount+=2;deliveries.set(key,{data:[{id:`internal-${mailCount}`},{id:`reply-${mailCount}`}]});}
 return {ok:true,status:200,json:async()=>deliveries.get(key)};
}});
const api=createServer(async(req,res)=>{
 const chunks=[];for await(const chunk of req)chunks.push(chunk);
 req.body=JSON.parse(Buffer.concat(chunks).toString()||'{}');
 res.status=function(code){this.statusCode=code;return this;};res.json=function(body){this.setHeader('Content-Type','application/json');this.end(JSON.stringify(body));};
 requests++;await handler(req,res);
});
await new Promise(resolve=>api.listen(4190,'127.0.0.1',resolve));
const server=await preview({preview:{port:4186,strictPort:true,proxy:{'/api':'http://127.0.0.1:4190'}}});
const browser=await chromium.launch({headless:true,channel:'chrome'});
try {
 for(const width of [1280,390]) {
  const page=await browser.newPage({viewport:{width,height:900}});mode='fail';const before=mailCount;
  await page.addInitScript(()=>localStorage.setItem('koda-lang','fr'));
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js',r=>r.fulfill({contentType:'application/javascript',body:`window.turnstile={render:(el,opts)=>{window.captchaOpts=opts;setTimeout(()=>opts.callback('test-token'),0);return 'widget';},reset:()=>setTimeout(()=>window.captchaOpts.callback('new-test-token'),0),remove:()=>{}};`}));
  await page.route(/https:\/\/(connect\.facebook\.net|www\.googletagmanager\.com)\//,r=>r.abort());
  await page.goto('http://localhost:4186/contact');
  await page.getByLabel(/Nom/).fill('Client intégration');await page.locator('input[type=email]').fill('integration@example.com');await page.getByLabel(/Message/).fill(`Projet de test ${width}px`);
  await page.locator('button[type=submit]').click();await page.getByRole('alert').waitFor();assert.equal(mailCount,before);assert.equal(await page.getByLabel(/Message/).inputValue(),`Projet de test ${width}px`);
  mode='success';await page.locator('button[type=submit]').click();await page.waitForFunction(()=>document.querySelector('textarea').value==='');assert.equal(mailCount,before+2);
  assert(logs.some(line=>line.event==='contact_emails_accepted'&&line.emailCount===2));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  console.log(`PASS ${width}px: real browser -> local HTTP API -> both Resend payloads; provider failure retains fields; success only with two IDs (upstream transport and CAPTCHA mocked).`);
  await page.close();
 }
 console.log(`PASS: ${requests} HTTP submissions, ${mailCount} test email payloads; no real email sent.`);
} finally {await browser.close();await Promise.all([new Promise(resolve=>server.httpServer.close(resolve)),new Promise(resolve=>api.close(resolve))]);}
