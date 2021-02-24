const Koa = require('koa');
const app = new Koa();
const PORT = 3000;
const sleep = function (delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
};

app.use(async (ctx, next) => {
  ctx.body = '1';
  // 洋葱模型可以用来计算请求时间
  next(); // ctx.body = '3'
  ctx.body = '2'; // ctx.body = '2'; res.end(ctx.body)
});

app.use(async (ctx, next) => { // 中间件中的逻辑应该是异步的，否则会阻塞其它逻辑执行
  ctx.body = '3';
  await sleep(3000); // promise.then(() => {next(); console.log(4)})
  next();
  ctx.body = '4';
});

app.use((ctx, next) => {
  ctx.body = '5';
  next();
  ctx.body = '6';
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});