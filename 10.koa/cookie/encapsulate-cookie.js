const http = require('http');
const querystring = require('querystring');
const PORT = 3000;
const server = http.createServer((req, res) => {
  const cookies = [];
  res.setCookie = function (name, value, options = {}) {
    const config = [];
    Object.keys(options).forEach(key => {
      if (key === 'maxAge') {
        config.push(`max-age=${options[key]}`);
      } else {
        config.push(`${key}=${options[key]}`);
      }
    });
    cookies.push(`${name}=${value}; ${config.join('; ')}`);
    // 每次设置都会向数组中添加新内容，然后通过新的响应头来覆盖之前的`Set-Cookie`响应头
    res.setHeader('Set-Cookie', cookies);
  };
  if (req.url === '/read') {
    const cookie = req.headers.cookie;
    const result = querystring.parse(cookie, '; ', '=');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(result));
  } else if (req.url === '/write') {
    // 设置cookie比较麻烦，可以封装一个方法
    res.setCookie('name', 'zs', { maxAge: 10 });
    res.setCookie('age', 10);
    // res.setHeader('Set-Cookie', ['name=zs; max-age=10', 'age=10',`hobby=say; expires=${new Date(Date.now() + 10000).toUTCString()}`]);
    res.end('write ok!');
  }
});

server.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});