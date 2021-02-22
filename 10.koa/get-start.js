// const Koa = require('./lib/application');
const Koa = require('koa');
const app = new Koa();

app.use((ctx) => { // 异步的use方法
  // ctx.body = 'Hello Koa';
  // ctx上既有原生属性，还会有自己封装的属性，并且会代理req和res上的属性
  // console.log('ctx.url', ctx.url);
  // console.log('ctx.req.url', ctx.req.url);
  // console.log('ctx.request.url', ctx.request.url);
  // console.log('ctx.request.req.url', ctx.request.req.url);
  // console.log('ctx.response.req.url', ctx.response.req.url);
  ctx.body = 'hello koa ';
  ctx.response.body += 'Ye';
});

app.listen(3000, () => {
  console.log(`server is listening on port 3000`);
});