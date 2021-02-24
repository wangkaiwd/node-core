const Koa = require('koa');
const app = new Koa();
const PORT = 3000;
// 中间件的作用：
// 1. 决定是否调用next向下执行。做权限：可以做统一拦截，如果不合法，不必再向下执行
// 2. 可以在中间件中扩展属性和方法,下一个中间件可以使用上一中间件扩展的属性和方法 (request.body(bodyparser),request.file(multer))
// 3. 分割逻辑，可以基于中间件，写一些插件(static-server)

// 1. use中传入的方法都会被包装成Promise
// 2. 把所有promise编程promise链(next前面必须加await,否则会出现(由之后中间件中的异步引发的)奇怪的逻辑)
app.use((ctx, next) => {
  console.log(1);
  next();
  console.log(2);
});

app.use((ctx, next) => {
  console.log(3);
  next();
  console.log(4);
});

app.use((ctx, next) => {
  console.log(5);
  // next();
  console.log(6);
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});