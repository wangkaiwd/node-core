const path = require('path');
const fs = require('fs/promises');
const mime = require('mime');
const { createReadStream, existsSync } = require('fs');

function serve (dirname = '.') {
  // 返回一个async函数
  return async (ctx, next) => {
    const absPath = path.join(__dirname, dirname, ctx.path);
    const exist = existsSync(absPath);
    if (exist) {
      const stats = await fs.stat(absPath);
      if (stats.isFile()) {
        const type = mime.getType(absPath);
        ctx.set('Content-Type', `${type}; charset=utf-8`);
        // koa will check type of ctx.body. koa will pipe it to writable stream if it is instance of Stream
        ctx.body = createReadStream(absPath);
      } else {
        await next();
      }
    } else {
      await next();
    }
  };
}

module.exports = serve;