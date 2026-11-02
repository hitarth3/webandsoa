const {test}=require('node:test');
const assert=require('node:assert/strict');
const service=process.env.TEST_SERVICE;
if (!service) throw new Error('Set TEST_SERVICE to a service directory');
const mod=require(`../${service}/src/app`);
const app=service==='api-gateway'?mod.createApp().app:mod.app;
test(`${service}: HTTP health, readiness and metrics`,async t=>{
 const server=app.listen(0,'127.0.0.1');
 await new Promise(resolve=>server.once('listening',resolve));
 t.after(()=>new Promise(resolve=>server.close(resolve)));
 const base=`http://127.0.0.1:${server.address().port}`;
 assert.equal((await fetch(base+'/health')).status,200);
 if(service!=='api-gateway') assert.equal((await fetch(base+'/ready')).status,503);
 const route=service==='api-gateway'?'/unknown-route':'/'+service.split('-')[0]+'s/not-a-number';
 assert.equal((await fetch(base+route)).status,service==='api-gateway'?404:400);
 const res=await fetch(base+'/metrics');assert.equal(res.status,200);
 assert.match(await res.text(),/http_requests_total\{[^}]+\} 1/);
});
