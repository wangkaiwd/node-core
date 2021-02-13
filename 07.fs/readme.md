## File System

* fs.copy: 读取大文件(>64k)时会淹没内存

需求：读取指定字节的内容，然后将读到的内容写到文件。读一点，写一点

手动读写：

* fs.open
* fs.read
* fs.write
* fs.close
* file descriptor