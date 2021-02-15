// class open
// write
// 再次调用write进行写入时，要将其放入链表创建的队列中
// 与highWaterMark进行对比，>=的话返回false
// 调用end方法会将文件关闭

// 1. new WriteStream
// 2. normalize parameters
// 3. _openWriteFs(this)
//    3.1. fs.open
//    3.2. emit('open'), emit('ready')
// 4. write -> Writable.prototype.write
// 5. writeOrBuffer
// 6. _write -> WriteStream.prototype._write
const EventEmitter = require('events');
const fs = require('fs');

class MyWriteStream extends EventEmitter {
  constructor (path, options) {
    super();
    this.normalizeOptions(path, options);
    this.init();
  }

  normalizeOptions (path, options) {
    this.path = path;
    this.flags = options.flags || 'w';
    this.encoding = options.encoding || 'utf8';
    this.fd = options.fd || null;
    this.mode = options.mode || 0o666;
    this.autoClose = options.autoClose || true;
    this.emitClose = options.emitClose || false;
    this.start = options.start || 0;
    this.highWaterMark = options.highWaterMark || 16 * 1024;
  }

  init () {
    this.pos = 0;
    this.queue = [];
    this.open();
  }

  open () {
    fs.open(this.path, this.flags, this.mode, (err, fd) => {
      if (err) {return this.emit('error');}
      this.emit('open');
    });
  }

  write (chunk) {

  }

  _write (chunk) {
    const buffer = Buffer.from(chunk);
    fs.write(this.fd, buffer, 0, buffer.length, this.pos, (err, written) => {
      if (err) {return this.emit('error');}
      this.pos += written;
    });
  }

  end () {

  }
}

module.exports = MyWriteStream;