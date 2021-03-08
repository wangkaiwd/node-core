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
    res.setHeader('Set-Cookie', ['name=zs', 'age=10']);
    res.end('write ok!');
  }
});

server.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});