const http = require('http');
const querystring = require('querystring');
const PORT = 3000;
const server = http.createServer((req, res) => {
  if (req.url === '/read') {
    const cookie = req.headers.cookie;
    const result = querystring.parse(cookie, '; ', '=');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(result));
  } else if (req.url === '/write') {
    // 设置cookie比较麻烦，可以封装一个方法
    res.setHeader('Set-Cookie', ['name=zs; max-age=10', 'age=10', `hobby=say; expires=${new Date(Date.now() + 10000).toUTCString()}`]);
    res.end('write ok!');
  }
});

server.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});