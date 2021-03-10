const http = require('http');
const querystring = require('querystring');
const crypto = require('crypto');
const PORT = 3000;
const SECRET_KEY = 'sign-cookie';
const sign = (value) => {
  // 加盐算法：放入不同的秘钥，产生不同的结果
  return crypto.createHmac('sha256', SECRET_KEY).update(value).digest('base64');
};
const server = http.createServer((req, res) => {
  const cookies = [];
  res.getCookie = function (name, options = {}) {
    if (!name) {
      return undefined;
    }
    const cookie = req.headers.cookie;
    const object = querystring.parse(cookie, '; ', '=');
    const value = object[name];
    if (options.signed) {
      const [val, hash] = value.split('.');
      // 如果客户端的值发生篡改，会导致签名生成的base64和之前的值生成的base64字符串无法对应
      if (sign(val) === hash) {
        return val;
      } else {
        return undefined;
      }
    }
    return value;
  };
  // 设置cookie时可以进行签名
  res.setCookie = function (name, value, options = {}) {
    const config = [];
    Object.keys(options).forEach(key => {
      if (key === 'maxAge') {
        config.push(`max-age=${options[key]}`);
      } else if (key === 'signed') { // 为cookie设置签名
        value = value + '.' + sign(value);
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
    const name = res.getCookie('age', { signed: true });
    res.end(name);
  } else if (req.url === '/write') {
    // 设置cookie比较麻烦，可以封装一个方法
    res.setCookie('name', 'zs', { maxAge: 10 });
    res.setCookie('age', 'xx', { signed: true });
    // 设置httpOnly浏览器将不能再通过document.cookie来获取和设置cookie
    // 但还是可以通过调试工具来直接修改
    res.setCookie('say', 'hello', { httpOnly: true });
    // domain: 可以用来指定可以接受cookie的域名
    // path：为了发送cookie头，必须在请求URL中存在的URL路径，一般不会有人设置
    // res.setHeader('Set-Cookie', ['name=zs; max-age=10', 'age=10',`hobby=say; expires=${new Date(Date.now() + 10000).toUTCString()}`]);
    res.end('write ok!');
  }
});

server.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});