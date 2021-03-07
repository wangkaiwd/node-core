const querystring = require('querystring');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');

function bodyParser ({ upload } = {}) {
  return async (ctx, next) => {
    // 等到Promise执行完成
    ctx.request.body = await getBody(ctx, upload);
    await next();
  };
}

function processFile ({ header, upload, result, body }) {
  const headerStr = header.toString();
  // 文件上传逻辑：将文件内容从请求中截取出来，将文件写入到对应的上传目录中，然后将文件信息作为数组(多文件上传)返回
  const originName = headerStr.match(/filename="(.+?)"/)[1];
  const filename = uuid.v4();
  const content = body.slice(header.length + 4, -2); // 开头:header + \r\n\r\n, 中间：content, 结尾：\r\n
  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload);
  }
  fs.writeFileSync(path.join(upload, filename), content);
  const files = result.files = result.files || [];
  files.push({
    size: content.length,
    name: originName,
    filename
  });
}

function parseMultipartFormData (contentType, buffer, upload) {
  const boundary = '--' + contentType.split('=')[1];
  const buffers = buffer.split(boundary).slice(1, -1);
  const result = {};
  // 拿到头和体
  buffers.forEach(buf => {
    const [header, body] = buf.split('\r\n\r\n');
    const headerStr = header.toString();
    if (!headerStr.includes('filename')) {
      const key = headerStr.match(/name="(.+?)"/)[1];
      result[key] = body.slice(0, -2).toString();
    } else {
      // 文件上传逻辑：将文件内容从请求中截取出来，将文件写入到对应的上传目录中，然后将文件信息作为数组(多文件上传)返回
      processFile({ header, upload, result, body });
    }
  });
  return result;
}

function getBody (ctx, upload) {
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
        const result = parseMultipartFormData(contentType, buffer, upload);
        resolve(result);
      } else {
        resolve();
      }
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