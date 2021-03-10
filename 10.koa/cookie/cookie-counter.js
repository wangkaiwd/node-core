const http = require('http');
const querystring = require('querystring');
const crypto = require('crypto');
const PORT = 3000;
const SECRET_KEY = 'sign-cookie';
const sign = (value) => {
  if (typeof value !== 'string') {
    value = String(value);
  }
  // base64在url中传输会出现问题： https://zh.wikipedia.org/wiki/Base64#URL
  // 加盐算法：放入不同的秘钥，产生不同的结果
  return crypto.createHmac('sha256', SECRET_KEY).update(value).digest('base64').replace(/[\/=+]/g, '');
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
    if (!value) {
      return undefined;
    }
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
  if (req.url === '/visit') {
    let visit = res.getCookie('visit', { signed: true }) || 0;
    console.log(visit);
    visit++;
    res.setCookie('visit', visit, { signed: true });
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    res.end(`用户访问了${visit}次`);
  }
});

server.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});