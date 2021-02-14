## Stream

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