const Koa = require('koa');
const bodyParser = require('../body-parser/body-parser');
const app = new Koa();
const PORT = 3000;

// koa-static: 处理完静态文件后，不再执行next，那么之后的中间件便不再执行
app.use(bodyParser()); // 每次请求之前都会将请求内容放到ctx.request.body上
// get /login: login page
app.use((ctx) => {
  ctx.body = 'hello world!';
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});