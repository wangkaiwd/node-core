const querystring = require('querystring');

function bodyParser () {
  return async (ctx, next) => {
    // 等到Promise执行完成
    ctx.request.body = await getBody(ctx);
    await next();
  };
}

function parseMultipartFormData () {

}

function getBody (ctx) {
  return new Promise((resolve, reject) => {
    const arr = [];
    ctx.req.on('data', (chunk) => {
      arr.push(chunk);
    });
    ctx.req.on('end', () => {
      // 要通过Buffer来进行拼接，字符串拼接可能会由于拼不成一个完整字符而出现乱码
      const buffer = Buffer.concat(arr);
      const body = buffer.toString();
      const contentType = ctx.get('Content-Type');
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST
      if (contentType.includes('application/x-www-form-urlencoded')) {
        resolve(querystring.parse(body));
      } else if (contentType.includes('application/json')) {
        resolve(JSON.parse(body));
      } else if (contentType.includes('plain/text')) {
        resolve(body);
      } else if (contentType.startsWith('multipart/form-data')) { // 文件上传：二进制，可能是图片或文本
        // 处理服务端传来的二进制内容
        const boundary = '--' + contentType.split('=')[1];
        // buffer.split(boundary);
        resolve();
      }
      resolve();
    });
  });
}

module.exports = bodyParser;

// 通过一段字符串来分割buffer
// 1111&111&11; 一段一段放到数组中
Buffer.prototype.split = function (separator) {
  const result = [];
  let offset = 0;
  let i = this.indexOf(separator, offset);
  // this是buffer
  // indexOf 获取分隔符的索引
  while (i !== -1) {
    const item = this.slice(offset, i);
    offset = i + separator.length;
    result.push(item);
    i = this.indexOf(separator, offset);
  }
  const lastItem = this.slice(offset);
  if (lastItem.length > 0) {
    result.push(lastItem);
  }
  return result;
};