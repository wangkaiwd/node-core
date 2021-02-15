// 需求：将demo.txt中的`0123456789` 每次读取2个字节，并且每次向text.txt中写入一个字节

const ReadStream = require('./read-stream-implement');
const WriteStream = require('./write-stream-implement');

const rs = new ReadStream('./demo.txt', {
  highWaterMark: 2
});
const ws = new WriteStream('./text.txt', {
  highWaterMark: 1
});

// rs.on('data', (chunk) => {
//   const flag = ws.write(chunk);
//   // 等到队列中的所有内容都写入完毕后，触发drain事件，继续写入内容
//   if (!flag) {
//     rs.pause();
//   }
// });
// rs.on('end', () => {
//   console.log('complete');
// });
//
// ws.on('drain', () => {
//   console.log('drain');
//   rs.resume();
// });
rs.pipe(ws);