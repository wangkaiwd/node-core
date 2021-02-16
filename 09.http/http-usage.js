const http = require('http');
let PORT = 3000;
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
// https://devdocs.io/node~14_lts/net#net_class_net_server: 继承自net.Server的error事件
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    // 端口+1重新开启一个服务
    PORT++;
    // server.listen(PORT, () => { // 这个会放到listening对应存放回调函数的数组中，并且由于之后加入，所以会在前一个listen事件的callback之后执行
    //   console.log('hh');
    // });
    server.listen(PORT);
    // 将会emit listening事件，执行server.listen中传入的回调，server.on('listening,cb)
    // 在次监听时不用再添加会回调，listening 事件emit时会执行所有附加到listening上的事件
  }
});