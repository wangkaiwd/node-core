const Koa = require('./lib');
const app = new Koa();

app.use((req, res) => { // 异步的use方法
                        // ctx.body = 'Hello Koa';
  res.write('Hello Koa!');
});

app.listen(3000, () => {
  console.log(`server is listening on port 3000`);
});