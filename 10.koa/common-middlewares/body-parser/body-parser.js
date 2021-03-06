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
      resolve(Buffer.concat(arr).toString());
    });
  });
}

module.exports = bodyParser;