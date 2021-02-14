const fs = require('fs');
const MyReadStream = require('./read-stream-implement');
// const readStream = fs.createReadStream('./text.txt', {
const readStream = new MyReadStream('./text.txt', {
  flags: 'r', // 文件系统标识，默认为r
  encoding: null, // 文件编码
  fd: null, // file descriptor
  mode: 0o666, // file permission
  autoClose: true,
  emitClose: true, // the stream will not emit a 'close' event after it has been destroyed
  // start: 0,
  // end: Infinity, // 左闭右闭[start,end]：Both start and end are inclusive and start counting at 0
  highWaterMark: 2,
  // fs: {}, By providing fs option, it is possible to override the corresponding `fs` implementations for `open`,`read`,`write`,`close`.When providing the `fs` option, overrides for `open`, `read`, and `close` is required
});
let str = ''; // 字符串拼接会有问题：比如：你好，一个汉字三个字节，每次读取2个字节，字符串拼接就会出现乱码
const body = []; // 所以这里要先将每一段读取到的Buffer放到数组中，然后使用Buffer.concat进行buffer的拼接
// 监听data事件后，可读流会自动切换到流动模式: 内部通过newListener实现
readStream.on('data', (chunk) => {
  str += chunk;
  // console.log(chunk);
  // console.log(str);
  // console.log(body);
  body.push(chunk); // Buffer
  readStream.pause(); // 停止读取
});

// 文件读取完毕，触发end事件
readStream.on('end', () => {
  // 要使用Buffer的拼接操作
  console.log(Buffer.concat(body).toString());
  // console.log(str.toString());
});

readStream.on('error', () => {
  console.log('occur some problems when read file');
});

// 文件流还有open,close事件，分别对应文件的打开和关闭操作
readStream.on('open', (fd) => {
  console.log('open', fd);
});

readStream.on('close', () => {
  console.log('close');
});
let prevBodyLength = 0;
// 每隔一秒读取一次数据，读取完后不再读取
const timerId = setInterval(() => {
  if (prevBodyLength !== body.length) {
    prevBodyLength = body.length;
    readStream.resume();
  } else {
    clearInterval(timerId);
  }
  console.log('setInterval');
}, 1000);