// Bounded labels: no user IDs, query strings or arbitrary paths.
module.exports = function installMetrics(app, service) {
  const counts = new Map();
  app.use((req, res, next) => {
    if (['/metrics', '/health', '/ready'].includes(req.path)) return next();
    const start = process.hrtime.bigint();
    res.on('finish', () => {
      const route = /^\/(users|products|orders)(\/|$)/.exec(req.path)?.[1] || 'other';
      const method = ['GET','POST','PUT','DELETE','PATCH','HEAD','OPTIONS'].includes(req.method) ? req.method : 'OTHER';
      const key = `service="${service}",method="${method}",route="${route}",status="${res.statusCode}"`;
      const v = counts.get(key) || {count:0,sum:0};
      v.count++; v.sum += Number(process.hrtime.bigint()-start)/1e9; counts.set(key,v);
    });
    next();
  });
  app.get('/metrics', (_req,res) => {
    let out = '# HELP http_requests_total Completed HTTP requests\n# TYPE http_requests_total counter\n';
    for (const [k,v] of counts) out += `http_requests_total{${k}} ${v.count}\n`;
    out += '# HELP http_request_duration_seconds HTTP request duration\n# TYPE http_request_duration_seconds summary\n';
    for (const [k,v] of counts) out += `http_request_duration_seconds_sum{${k}} ${v.sum}\nhttp_request_duration_seconds_count{${k}} ${v.count}\n`;
    res.type('text/plain; version=0.0.4').send(out);
  });
};
