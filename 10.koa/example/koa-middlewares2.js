const Koa = require('../lib/application');
// const Koa = require('koa');
const app = new Koa();
const PORT = 3000;
const sleep = function (delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(); // 执行时才会异步的(微任务)执行.then中的回调
      console.log('sleep');
    }, delay);
  });
};

app.use(async (ctx, next) => {
  console.log(1);
  await next();
  console.log(2);
});

app.use(async (ctx, next) => {
  console.log(3);
  await sleep(1000); // promise.then(() => {next(); console.log(4)})
  await next();
  console.log(4);
});

app.use((ctx, next) => {
  console.log(5);
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
// 1
// 3
// 2
// sleep
// 5
// 4