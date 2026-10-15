import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { chromium } from 'playwright';
import path from 'node:path';
import assert from 'node:assert/strict';
import { buildContactEmails } from '../server/contact-emails.js';
const out='scripts/.email-previews';mkdirSync(out,{recursive:true});
const emails=buildContactEmails({name:'Salma Exemple',email:'client@example.com',phone:'+212 600 000 000',website:'https://example.com',projectType:'Site vitrine',budget:'20 000 – 50 000 MAD',message:'Bonjour,\nNous souhaitons créer un site pour notre activité à Marrakech.\nMerci de nous proposer un rendez-vous.',language:'fr',utm:'utm_source=instagram · utm_campaign=site-vitrine'});
const browser=await chromium.launch({headless:true,channel:'chrome'});
try {
 for(const [index,email] of emails.entries()) {
  const name=index===0?'notification':'auto-reply';writeFileSync(path.join(out,`${name}.html`),email.html);
  for(const width of [800,390]) {
   const page=await browser.newPage({viewport:{width,height:900}});
   await page.route('https://kodaatlas.com/og-image.png',r=>r.fulfill({contentType:'image/png',body:readFileSync('public/og-image.png')}));
   await page.setContent(email.html,{waitUntil:'load'});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   assert.equal(await page.locator('img').evaluate(img=>img.complete&&img.naturalWidth>0),true);
   assert.equal(await page.locator('h1').count(),1);
   await page.screenshot({path:path.join(out,`${name}-${width}.png`),fullPage:true});
   console.log(`PASS: ${name} ${width}px, logo and responsive HTML. Preview only; real email clients not tested.`);
   await page.close();
  }
 }
} finally {await browser.close();}
console.log(path.resolve(out));
