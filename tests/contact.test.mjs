import test from 'node:test';
import assert from 'node:assert/strict';
import { createContactHandler } from '../api/contact.js';
const valid = { name: ' Test ', email: 'test@example.com', message: 'Bonjour', captchaToken: 'token' };
async function run({body=valid, method='POST', env={EMAILJS_PRIVATE_KEY:'private-test',TURNSTILE_SECRET_KEY:'secret-test'}, captcha={success:true,hostname:'kodaatlas.com'}, status=200, acknowledgment='OK', fail, headers={'content-type':'application/json'}}={}) {
 const calls=[], logs=[];
 const transport=async(url,options)=>{calls.push({url,options});if(fail)throw fail;return url.includes('siteverify')?{ok:true,json:async()=>captcha}:{status,text:async()=>acknowledgment};};
 const res={headers:{},setHeader(k,v){this.headers[k]=v;},status(s){this.statusCode=s;return this;},json(v){this.body=v;return this;}};
 await createContactHandler({env,transport,logger:{info:s=>logs.push(s)}})({method,body,headers},res);
 return {res,calls,logs};
}
test('confirmed provider acknowledgment required; optional fields and campaign preserved',async()=>{const {res,calls,logs}=await run({body:{...valid,budget:'20k',utm:'campaign'}});assert.equal(res.statusCode,200);assert.equal(res.body.success,true);const payload=JSON.parse(calls[1].options.body);assert.equal(payload.template_params.name,'Test');assert.equal(payload.template_params.phone,'Non précisé');assert.equal(payload.template_params.budget,'20k');assert.equal(payload.template_params.utm,'campaign');assert(!JSON.stringify(logs).includes('test@example.com'));assert(!JSON.stringify(logs).includes('private-test'));});
for (const body of [{...valid,name:' '},{...valid,email:'bad'},{...valid,message:[]},{...valid,message:'x'.repeat(10001)},null,'{', {...valid,kd_ref_field:'bot'},{...valid,captchaToken:''}]) test(`invalid request ${JSON.stringify(body)?.slice(0,70)}`,async()=>{const {res,calls}=await run({body});assert.equal(res.statusCode,400);assert.equal(res.body.success,false);assert.equal(calls.length,0);});
test('method and content type enforced',async()=>{assert.equal((await run({method:'GET'})).res.statusCode,405);assert.equal((await run({headers:{}})).res.statusCode,415);});
test('missing secrets never call external services',async()=>{const {res,calls}=await run({env:{}});assert.equal(res.statusCode,503);assert.equal(calls.length,0);});
for (const captcha of [{success:false},{success:true,hostname:'attacker.example'}]) test('captcha verified before sending',async()=>{const {res,calls}=await run({captcha});assert.equal(res.statusCode,400);assert.equal(calls.length,1);});
for (const status of [400,401,403,429,500]) test(`provider ${status} never returns success`,async()=>{const {res}=await run({status});assert.equal(res.statusCode,502);assert.equal(res.body.success,false);});
test('unexpected provider 200 body never returns success',async()=>{assert.equal((await run({acknowledgment:'<html>OK</html>'})).res.statusCode,502);});
test('network and timeout errors are handled',async()=>{assert.equal((await run({fail:new Error('secret diagnostic')})).res.statusCode,502);assert.equal((await run({fail:new DOMException('timeout','TimeoutError')})).res.statusCode,504);});
test('email timeout is explicitly uncertain and never a success',async()=>{
 let calls=0;const res={setHeader(){},status(s){this.statusCode=s;return this;},json(v){this.body=v;}};
 await createContactHandler({env:{EMAILJS_PRIVATE_KEY:'private',TURNSTILE_SECRET_KEY:'secret'},logger:{info(){}},transport:async()=>{if(++calls===1)return {ok:true,json:async()=>({success:true,hostname:'kodaatlas.com'})};throw new DOMException('timeout','TimeoutError');}})({method:'POST',body:valid,headers:{'content-type':'application/json'}},res);
 assert.equal(res.statusCode,504);assert.equal(res.body.code,'DELIVERY_UNKNOWN');assert.equal(res.body.success,false);
});
