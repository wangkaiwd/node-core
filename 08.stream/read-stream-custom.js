// 基于Readable实现可读流
// 自己实现_read方法，当开始读取内容时，调用此方法

// 源码流程：
// 1. new ReadStream
// 2. normalize options parameters
// 3. ReadStream 继承 Readable (call + setPrototypeOf)
// 4. _openReadFS：fs.open
//    stream.read -> Readable.prototype.read -> ReadStream.prototype._read
// 5. Readable.prototype.read => ReadStream.prototype._read
// 6. fs.read

const { Readable } = require('stream');

class MyRead extends Readable { // 自动调用Readable.read方法，然后调用子类的_read方法
  _read () {
    this.push('ok'); // 向可读流中添加内容
    this.push(null); // 停止写入
  }
}

const myRead = new MyRead();

myRead.on('data', (chunk) => {
  console.log(chunk.toString());
});
myRead.on('end', () => {
  console.log('end');
});