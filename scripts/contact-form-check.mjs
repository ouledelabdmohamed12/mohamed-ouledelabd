import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { preview } from 'vite';
const server=await preview({preview:{port:4185,strictPort:true}});
const browser=await chromium.launch({headless:true,channel:'chrome'});
try {
 for (const width of [1280,390]) {
  const page=await browser.newPage({viewport:{width,height:900}});
  await page.addInitScript(()=>localStorage.setItem('koda-lang','fr'));
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js',r=>r.fulfill({contentType:'application/javascript',body:`window.turnstile={render:(el,opts)=>{window.captchaOpts=opts;setTimeout(()=>opts.callback('test-token'),0);return 'widget';},reset:()=>setTimeout(()=>window.captchaOpts.callback('new-test-token'),0),remove:()=>{}};`}));
  await page.route(/https:\/\/(connect\.facebook\.net|www\.googletagmanager\.com)\//,r=>r.abort());
  let requests=0, mode='failure';
  await page.route('**/api/contact',async r=>{requests++;assert.equal(r.request().postDataJSON().captchaToken.includes('test-token'),true);await new Promise(resolve=>setTimeout(resolve,350));await r.fulfill({status:mode==='success'?200:502,contentType:'application/json',body:JSON.stringify(mode==='success'?{success:true}:{success:false,code:'EMAIL_FAILED'})});});
  await page.goto('http://localhost:4185/contact');
  const submit=page.locator('button[type=submit]');
  await submit.click();await page.getByRole('alert').waitFor();assert.equal(requests,0);
  await page.getByLabel(/Nom/).fill('Client Test');
  await page.locator('input[type=email]').fill('invalide');
  await page.getByLabel(/Message/).fill('Demande de test');
  await submit.click();assert.equal(requests,0);
  await page.locator('input[type=email]').fill('test@example.com');
  await submit.click();assert.equal(await submit.isDisabled(),true);
  // A second DOM submission while pending must not issue a second request.
  await page.locator('form').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  await page.getByRole('alert').waitFor();assert.equal(requests,1);assert.equal(await page.getByLabel(/Message/).inputValue(),'Demande de test');
  mode='success';await submit.click();await page.waitForFunction(()=>document.querySelector('textarea').value==='');assert.equal(requests,2);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true);
  console.log(`PASS contact ${width}px: required fields, email, loading, duplicate prevention, failure retention, confirmed success, no horizontal overflow (mocked API/widget)`);
  await page.close();
 }
} finally {await browser.close();await new Promise(resolve=>server.httpServer.close(resolve));}
