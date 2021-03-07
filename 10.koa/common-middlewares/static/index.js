const Koa = require('koa');
const bodyParser = require('../body-parser/body-parser');
const serve = require('./static');
const app = new Koa();
const PORT = 3000;

// koa-static: 处理完静态文件后，不再执行next，那么之后的中间件便不再执行
app.use(serve());
app.use(bodyParser()); // 每次请求之前都会将请求内容放到ctx.request.body上
// get /login: login page
app.use(async (ctx, next) => {
  if (ctx.path === '/') {
    ctx.body = 'hello world!';
  } else {
    await next();
  }
});

app.use((ctx) => {
  if (ctx.path === '/login' && ctx.method === 'POST') {
    ctx.body = ctx.request.body;
  }
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});