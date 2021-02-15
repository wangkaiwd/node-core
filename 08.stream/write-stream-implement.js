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
    this.writting = false; // 是否正在写入
    this.needDrain = false; // 是否需要触发drain事件
    this.len = 0; // 写入内容的总长度
    this.open();
  }

  open () {
    fs.open(this.path, this.flags, this.mode, (err, fd) => {
      if (err) {return this.emit('error');}
      this.fd = fd;
      this.emit('open');
    });
  }

  write (chunk, encoding, cb) { // 调用write方法，由于事件环，会先执行该函数，此时拿不到fd
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    this.len += chunk.length;
    if (!this.writting) {
      this.writting = true;
      this._write(chunk, encoding, cb);
    } else {
      this.queue.push({ chunk, encoding, cb });
    }
    this.needDrain = this.len >= this.highWaterMark;
    return !this.needDrain;
  }

  clearBuffer (written) {
    // 总长度减去已经写入完成的字节数
    this.pos += written;
    this.len -= written;
    const item = this.queue.shift();
    if (item) {
      const { chunk, encoding, cb } = item;
      this._write(chunk, encoding, cb);
    } else {
      this.writting = false; // 停止写入
      if (this.needDrain) { // 直到将队列中存储的所有内容都写完，才会继续将内容写入，此时触发drain事件
        this.needDrain = false;
        this.emit('drain');
      }
    }
  }

  _write (chunk, encoding, cb) { // 调用cb时才会继续读取？
    if (typeof this.fd !== 'number') {
      this.once('open', () => {
        this._write(chunk, encoding, cb);
      });
      return;
    }
    const buffer = Buffer.from(chunk);
    fs.write(this.fd, buffer, 0, buffer.length, this.pos, (err, written) => {
      if (err) {return this.emit('error');}
      cb?.();
      this.clearBuffer(written);
    });
  }

  end () { // 关闭文件，要等到所有的内容读取完毕
    // fs.close(this.fd, () => {
    //   if (this.emitClose) {
    //     this.emit('close');
    //   }
    // });
  }
}

module.exports = MyWriteStream;