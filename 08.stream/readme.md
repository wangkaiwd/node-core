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

* [API for stream implementers](https://nodejs.org/api/stream.html#stream_api_for_stream_implementers)

### Write Stream

* fs.createWriteStream


* [write](https://devdocs.io/node~14_lts/stream#stream_writable_write_chunk_encoding_callback)
  * The return value is `true` if the internal buffer is less than `highWaterMark` configured when the stream was
    created after admitting `chunk`.If `false` is returned, further attempts to write data to stream should stop until
    the `drain` event is emitted.
  * 内部用链表来存储每次`write`操作
* [end](https://devdocs.io/node~14_lts/stream#stream_writable_end_chunk_encoding_callback)

文件：

* on('open')
* on('close')

链表实现队列：

* 数组：每次将第一个元素删除，需要将所有之后的元素向前移动一个索引，时间复杂度O(n)
* 链表：将`head`对应的`value`取出后，直接将`head`向后移动即可：`head = head.next`，时间复杂度为O(1)

documentation:

* [Backpressuring in Streams](https://nodejs.org/en/docs/guides/backpressuring-in-streams/)