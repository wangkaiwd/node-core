const Koa = require('koa');
const bodyParser = require('./body-parser');
const app = new Koa();
const PORT = 3000;

app.use(bodyParser()); // 每次请求之前都会将请求内容放到ctx.request.body上
// get /login: login page
app.use((ctx, next) => {
  if (ctx.path === '/login' && ctx.method === 'GET') {
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
    ctx.body = `
      <form action="/login" method="post">
        用户名：<input name="username" type="text">
        密码: <input name="password" type="password">
        <button type="submit">提交</button>
      </form>
    `;
  } else {
    next();
  }
});

app.use((ctx, next) => {
  if (ctx.path === '/login' && ctx.method === 'POST') {
    // 解析请求参数
    ctx.body = ctx.request.body;
  } else {
    // 这里调用next其实相当于直接返回Promise.resolve()
    next();
  }
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});