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