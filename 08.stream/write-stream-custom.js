const { Writable } = require('stream');
const path = require('path');

class MyWriteStream extends Writable {
  _write (chunk, encoding, cb) {
    console.log(chunk.toString());
    // 调用cb才会进行下一次写入
    cb();
  }
}

const ws = new MyWriteStream(path.resolve(__dirname, './text.txt'));
ws.write('1');
ws.write('2');
ws.end();