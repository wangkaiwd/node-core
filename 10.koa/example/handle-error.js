const Koa = require('../lib/application');
const app = new Koa();
const PORT = 3000;
app.use(async (ctx, next) => {
  throw Error('I am an error message');
  console.log(1);
  await next();
});

app.use((ctx, next) => {
  ctx.body = 'Hello Koa';
});

app.on('error', (e, ctx) => {
  console.log('ctx', e);
});
app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});