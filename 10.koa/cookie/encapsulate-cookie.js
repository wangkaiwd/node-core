const http = require('http');
const querystring = require('querystring');
const PORT = 3000;
const server = http.createServer((req, res) => {
  const cookies = [];
  res.getCookie = function (name) {
    const cookie = req.headers.cookie;
    const object = querystring.parse(cookie, '; ', '=');
    if (!name) {
      return object;
    }
    return object[name];
  };
  res.setCookie = function (name, value, options = {}) {
    const config = [];
    Object.keys(options).forEach(key => {
      if (key === 'maxAge') {
        config.push(`max-age=${options[key]}`);
      } else {
        config.push(`${key}=${options[key]}`);
      }
    });
    let cookie = `${name}=${value}`;
    if (config.length > 0) {
      cookie += '; ' + config.join('; ');
    }
    cookies.push(cookie);
    // 每次设置都会向数组中添加新内容，然后通过新的响应头来覆盖之前的`Set-Cookie`响应头
    res.setHeader('Set-Cookie', cookies);
  };
  if (req.url === '/read') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    const name = res.getCookie('name');
    res.end(name);
  } else if (req.url === '/write') {
    // 设置cookie比较麻烦，可以封装一个方法
    res.setCookie('name', 'zs', { maxAge: 10 });
    res.setCookie('age', 10);
    res.setCookie('say', 'hello');
    // domain: 可以用来指定可以接受cookie的域名
    // path：为了发送cookie头，必须在请求URL中存在的URL路径，一般不会有人设置
    // res.setHeader('Set-Cookie', ['name=zs; max-age=10', 'age=10',`hobby=say; expires=${new Date(Date.now() + 10000).toUTCString()}`]);
    res.end('write ok!');
  }
});

server.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});