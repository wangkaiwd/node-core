const fs = require('fs');
const readStream = fs.createReadStream('./readme.md', {
  flags: 'r', // 文件系统标识，默认为r
  encoding: null, // 文件编码
  fd: null, // file descriptor
  mode: 0o666, // file permission
  autoClose: true,
  emitClose: false,
  // start: 0,
  // end: Infinity,
  // highWaterMark: 64*1024
  // fs: {}, By providing fs option, it is possible to override the corresponding `fs` implementations for `open`,`read`,`write`,`close`.When providing the `fs` option, overrides for `open`, `read`, and `close` is required
});
const body = []; // 用字符串会有问题？
// 监听data事件后，可读流会自动切换到流动模式: 内部通过newListener实现
readStream.on('data', (chunk) => {
  body.push(chunk); // Buffer
});

// 文件读取完毕，触发end事件
readStream.on('end', () => {
  // 要使用Buffer的拼接操作
  console.log(Buffer.concat(body).toString());
});

readStream.on('error', () => {
  console.log('occur some problems when read file');
});

// 文件流还有open,close事件，分别对应文件的打开和关闭操作