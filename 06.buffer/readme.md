## Buffer

### web binary

* download file
  * blob
* file preview
  * fileReader
* arrayBuffer


* buffer中都是16进制

进制转化：

* parseInt
* Number.toString()
  * 255.0.toString(2) 255.toString()点会被认为小数点

base64:

* 替代url
* 数据传递
* 转换结果比以前大1/3

### basic usage of Buffer

* 服务器中可以操作二进制Buffer
* Buffer可以和字符串随便转换
* buffer声明出来后固定大小，不能随意改变
* 后端声明大小的数量，都是字节数

* declare of Buffer
  * Buffer.alloc
  * Buffer.from
* buffer.length
* buffer.toString
* buffer.copy
  * implement
* Buffer.concat
* Buffer.slice
* Buffer.isBuffer