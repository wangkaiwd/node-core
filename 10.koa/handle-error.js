const Koa = require('./lib/application');
const app = new Koa();
const PORT = 3000;
app.use(() => {
  throw Error('I am an error message');
});

app.on('error', (e, ctx) => {
  console.log('ctx', e);
});
app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});