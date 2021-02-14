// 1. debug source code
// 2. implement
//{
//   flags: 'r', // 文件系统标识，默认为r
//   encoding: null, // 文件编码
//   fd: null, // file descriptor
//   mode: 0o666, // file permission
//   autoClose: true,
//   emitClose: true, // the stream will not emit a 'close' event after it has been destroyed
//   // start: 0,
//   // end: Infinity, // 左闭右闭[start,end]：Both start and end are inclusive and start counting at 0
//   highWaterMark: 2,
//   // fs: {}, By providing fs option, it is possible to override the corresponding `fs` implementations for `open`,`read`,`write`,`close`.When providing the `fs` option, overrides for `open`, `read`, and `close` is required
// }
const EventEmitter = require('events');
const fs = require('fs');

class MyReadStream extends EventEmitter {
  constructor (path, options) {
    super();
    this.normalizeOptions(path, options);
    this.pos = this.start || 0;
    this.on('newListener', (name, listener) => {
      if (name === 'data') { // 监听data事件，开始读取内容
        this.open();
      }
    });
  }

  normalizeOptions (path, options) {
    this.path = path;
    this.flags = options.flags || 'r';
    this.encoding = options.encoding || null;
    this.mode = options.mode || 0o666;
    this.autoClose = options.autoClose || true;
    this.emitClose = options.emitClose || false;
    this.start = options.start || 0;
    this.end = options.end || Infinity;
    this.highWaterMark = options.highWaterMark || 64 * 1024;
  }

  open () {
    fs.open(this.path, this.flags, this.mode, (err, fd) => {
      if (err) {
        return this.emit('error', err);
      }
      this.emit('open', fd);
      this.read(fd);
    });
  }

  read (fd) {
    const buffer = Buffer.alloc(this.highWaterMark);
    fs.read(fd, buffer, 0, buffer.length, this.pos, (err, bytesRead) => {
      if (err) {return this.emit('error', err);}
      if (bytesRead) {
        this.pos += bytesRead;
        this.emit('data', buffer.slice(0, bytesRead));
        this.read(fd);
      } else {
        this.close(fd);
      }
    });
  }

  close (fd) {
    fs.close(fd, (err) => {
      if (err) {return this.emit('error', err);}
      this.emit('close');
      this.emit('end');
    });
  }

  pause () {

  }

  resume () {

  }
}

module.exports = MyReadStream;