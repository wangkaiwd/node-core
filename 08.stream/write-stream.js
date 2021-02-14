const fs = require('fs');
const path = require('path');
const writeStream = fs.createWriteStream(path.resolve(__dirname, './demo.txt'), {
  flags: 'w',
  encoding: 'utf8',
  autoClose: true,
  highWaterMark: 4, // 高水位线标志
});
const bool1 = writeStream.write('1', () => {
  console.log('ok');
});
console.log(bool1);
const bool2 = writeStream.write('2');
console.log(bool2);
// 当写入的字节长度超过(>=)highWaterMark时，会返回false,此时需要等到drained事件发射时，再进一步向可写流中写入数据
const bool3 = writeStream.write('345');
console.log(bool3);

writeStream.end();
// writeStream.write('3'); //