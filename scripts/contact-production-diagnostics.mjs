import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true, channel:"chrome"});
const page=await browser.newPage();
const issues=[];const fonts=[];
page.on('console',m=>{if(['warning','error'].includes(m.type())) issues.push({type:m.type(),text:m.text(),location:m.location()});});
page.on('pageerror',e=>issues.push({type:'pageerror',text:e.message}));
page.on('response',async r=>{if(r.request().resourceType()==='font'){try{const b=await r.body();fonts.push({url:r.url(),status:r.status(),type:r.headers()['content-type'],bytes:b.length,signature:b.subarray(0,4).toString()});}catch{}}});
try{await page.goto('https://kodaatlas.com/contact',{waitUntil:'domcontentloaded',timeout:30000}).catch(e=>issues.push({type:'navigation',text:e.message}));await page.waitForTimeout(8000);console.log(JSON.stringify({title:await page.title(),issues,fonts},null,2));}finally{await browser.close();}

