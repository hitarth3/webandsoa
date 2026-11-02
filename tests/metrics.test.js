const {test} = require('node:test');
const assert = require('node:assert/strict');
const {EventEmitter} = require('node:events');
for (const service of ['api-gateway','user-service','product-service','order-service']) {
 test(`${service}: request counts, bounded labels, and scrape exclusion`, () => {
   let middleware, scrape;
   require(`../${service}/src/metrics`)({use(fn){middleware=fn},get(path,fn){scrape=fn}},service);
   for (let i=0;i<2;i++) {
     const res=new EventEmitter();res.statusCode=400;
     middleware({path:'/users/private-id',method:'GET'},res,()=>{});res.emit('finish');
   }
   let body; scrape({}, {type(){return this},send(text){body=text}});
   assert.match(body,/http_requests_total\{[^}]+\} 2/);
   assert.match(body,/duration_seconds_count\{[^}]+\} 2/);
   assert.ok(!body.includes('private-id'));
   const res=new EventEmitter();middleware({path:'/metrics'},res,()=>{});
   assert.equal(res.listenerCount('finish'),0);
 });
}
