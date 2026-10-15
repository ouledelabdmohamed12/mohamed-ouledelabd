import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/contact.js';
test('default Vercel handler exposes the single Resend API without provider configuration',async()=>{
 const res={headers:{},setHeader(k,v){this.headers[k]=v;},status(code){this.statusCode=code;return this;},json(body){this.body=body;return this;}};
 await handler({method:'GET'},res);
 assert.equal(res.statusCode,405);assert.equal(res.body.code,'METHOD_NOT_ALLOWED');assert.equal(res.headers.Allow,'POST');assert.equal(res.headers['Cache-Control'],'no-store');
});
