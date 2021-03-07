const querystring = require('querystring');

function bodyParser () {
  return async (ctx, next) => {
    // 等到Promise执行完成
    ctx.request.body = await getBody(ctx);
    await next();
  };
}

function getBody (ctx) {
  return new Promise((resolve, reject) => {
    const arr = [];
    ctx.req.on('data', (chunk) => {
      arr.push(chunk);
    });
    ctx.req.on('end', () => {
      // 要通过Buffer来进行拼接，字符串拼接可能会由于拼不成一个完整字符而出现乱码
      const body = Buffer.concat(arr).toString();
      const contentType = ctx.get('Content-Type');
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST
      if (contentType.includes('application/x-www-form-urlencoded')) {
        resolve(querystring.parse(body));
      } else if (contentType.includes('application/json')) {
        resolve(JSON.parse(body));
      } else if (contentType.includes('plain/text')) {
        resolve(body);
      }
      resolve();
    });
  });
}

module.exports = bodyParser;