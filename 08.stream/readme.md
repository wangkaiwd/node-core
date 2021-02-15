## Stream

### Read Stream

* fs.createReadStream
  * understand options parameters
  * basic usage
  * string-decoder
  * 控制读取速率(pause,resume)

可读流对象：

* on('data')
* on('end')

文件流还会提供俩个方法：

* on('open')
* on('close')

### Implement Read Stream

* [API for stream implementers](https://nodejs.org/api/stream.html#stream_api_for_stream_implementers)
* _read
* push

### theory of Read Stream

打开文件递归调用fs.read方法一点点写入内容，写入完成后调用fs.close关闭文件

* fs.open
* [fs.read](https://github.com/wangkaiwd/node-core/blob/9fc2868f4be497535f08ddd810464129c7a194cd/08.stream/read-stream-implement.js#L66-L69)
* fs.close

### Write Stream

* fs.createWriteStream


* [write](https://devdocs.io/node~14_lts/stream#stream_writable_write_chunk_encoding_callback)
  * The return value is `true` if the internal buffer is less than `highWaterMark` configured when the stream was
    created after admitting `chunk`.If `false` is returned, further attempts to write data to stream should stop until
    the `drain` event is emitted.
  * 内部用链表来存储每次`write`操作
* [end](https://devdocs.io/node~14_lts/stream#stream_writable_end_chunk_encoding_callback)
* [drain](https://devdocs.io/node~14_lts/stream#stream_event_drain)

文件：

* on('open')
* on('close')

链表实现队列：

* 数组：每次将第一个元素删除，需要将所有之后的元素向前移动一个索引，时间复杂度O(n)
* 链表：将`head`对应的`value`取出后，直接将`head`向后移动即可：`head = head.next`，时间复杂度为O(1)

documentation:

* [Backpressuring in Streams](https://nodejs.org/en/docs/guides/backpressuring-in-streams/)

### Implement Write Stream

* [Implementing a writable stream](https://nodejs.org/dist/latest-v14.x/docs/api/stream.html#stream_implementing_a_writable_stream)
* _write(chunk,encoding,cb): 写入chunk以后调用cb

### theory of Write Stream

有问题的点记录：

1. needDrain：是否需要出发drain事件？
2. 写入内容总长度：开始写入，长度+写入内容，写入完成，要将长度再减去
3. 什么时候要将needDrain进行重置？
4. [处理`chunk`的类型](https://github.com/wangkaiwd/node-core/blob/8e83f55f552cb6a6fbf7416b6ca19b010ff245dd/08.stream/write-stream-implement.js#L55)