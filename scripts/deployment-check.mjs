import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
const readJSON=p=>JSON.parse(readFileSync(p,'utf8'));
const config=readJSON('vercel.json');
const pkg=readJSON('package.json');
const lock=readJSON('package-lock.json');
assert.equal(pkg.type,'module');
assert(!Object.keys(pkg.dependencies || {}).some(name => /emailjs/i.test(name)));
assert(!Object.keys(lock.packages).some(name => /emailjs/i.test(name)));
assert.equal(pkg.engines.node,'22.x');
assert.deepEqual(pkg.dependencies,lock.packages[''].dependencies);
assert.deepEqual(pkg.devDependencies,lock.packages[''].devDependencies);
assert.deepEqual(pkg.engines,lock.packages[''].engines);
assert.equal(config.framework,'vite');
assert.equal(config.outputDirectory,'dist');
assert.equal(config.functions['api/contact.js'].maxDuration,30);
assert.equal(config.functions['api/contact.js'].includeFiles,'server/templates/*.html');
for(const name of ['contact-us','auto-reply']) assert(readFileSync(`server/templates/${name}.html`, 'utf8').includes('https://kodaatlas.com/og-image.png'));
const rule=config.rewrites[0];
const route=new RegExp(`^${rule.source}$`);
assert(route.test('/contact'));
assert(!route.test('/api/contact'));
assert.equal(typeof (await import('../api/contact.js')).default,'function');
for (const dir of ['api', 'server', 'src']) {
 for (const file of files(dir).filter(file => /\.(js|jsx|ts|tsx)$/.test(file))) {
  assert(!/emailjs|contact_mail_provider/i.test(readFileSync(file, 'utf8')), `Removed provider reference in ${file}`);
 }
}
console.log('PASS: manifest/lock consistency, single provider, Node 22 ESM handler, deployment settings and API exclusion from SPA rewrite.');
const canaries={RESEND_API_KEY:'deployment-check-resend-private-canary',TURNSTILE_SECRET_KEY:'deployment-check-turnstile-secret-canary'};
const result=spawnSync(process.execPath,['node_modules/vite/bin/vite.js','build'],{env:{...process.env,...canaries},stdio:'inherit'});
assert.equal(result.status,0,'Production build failed');
function files(dir){return readdirSync(dir).flatMap(name=>{const p=path.join(dir,name);return statSync(p).isDirectory()?files(p):[p];});}
for(const p of files('dist')) {
 const text=readFileSync(p).toString('utf8');
 for(const secret of Object.values(canaries)) assert(!text.includes(secret),`Secret canary found in ${p}`);
 assert(!/RESEND_API_KEY|TURNSTILE_SECRET_KEY|api\.resend\.com|api\.emailjs\.com\/api\/v1\.0\/email\/send/.test(text),`Server code found in ${p}`);
}
console.log('PASS: neither server secret canary nor mail-server implementation appears in dist. No remote deployment or email was performed.');
