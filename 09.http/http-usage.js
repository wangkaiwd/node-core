const http = require('http');
const PORT = 3000;
const server = http.createServer((req, res) => {
  // 将当于将该函数作为回调函数添加给request事件，当 request 事件 emit 时执行
  console.log('req,res', req, res);
  res.end('hello world!');
});
// server.on('request', (req, res) => {
//   console.log('req,res', req, res);
//   // req: 可读流
//   // res: 可写流
//   res.end('hello world!');
// });

// listening event
// https://devdocs.io/node~14_lts/net#net_server_listen
server.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});