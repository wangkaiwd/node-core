## File System

### copy file

* fs.copy: 读取大文件(>64k)时会淹没内存

需求：读取指定字节的内容，然后将读到的内容写到文件。读一点，写一点

手动读写：

* fs.open
* fs.read
* fs.write
* fs.close
* [file descriptor](https://nodejs.org/api/fs.html#fs_file_descriptors)
* fs.readFile: If no encoding is specified, then the raw buffer is returned
* fs.writeFile: Encoding is utf8 by default

### directory operation

* fs.mkdir
* fs.readdir
* fs.stat
* fs.unlink: 删除文件

demo:

* async recursive remove directory
  * callback style / promise style / async + await style
  * 并行删除：同时删除所有的孩子，等到所有的孩子删除完成后再删除当前文件
  * 串行删除：一个孩子删除完成后再删除下一个孩子
  * deep traverse delete
  * breadth traverse delete
    ![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/20210218172613.png)
* recursive make directory
  * callback style/ promise style/ async + await style

async await delete:

* Promise.all: [delete in parallel](https://stackoverflow.com/a/37576787/12819402)
