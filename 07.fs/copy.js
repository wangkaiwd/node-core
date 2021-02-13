const fs = require('fs');
const path = require('path');

// recursive read source file and write to destination file
function copy (src, dest, cb) {
  const buffer = Buffer.alloc(3);// 字节
  let readPosition = 0;
  let writePosition = 0;
  fs.open(src, 'r', (err, rfd) => {
    fs.open(dest, 'w', (err, wfd) => {
      function next () {
        fs.read(rfd, buffer, 0, buffer.length, readPosition, (err, bytesRead) => {
          // 将指定文件指定位置的内容读取出来，并写到buffer中
          if (bytesRead) {
            fs.write(wfd, buffer.slice(0, bytesRead), 0, bytesRead, writePosition, (err, written) => {
              readPosition += bytesRead;
              writePosition += written;
              console.log(buffer.toString());
              next();
            });
          } else { // 读取到的字节数为0
            fs.close(rfd, () => {});
            fs.close(wfd, () => {});
            cb();
          }
        });
      }

      next();
    });
  });
}

copy(path.resolve(__dirname, './basic-usage.js'), path.resolve(__dirname, './demo.js'), () => {
  console.log('copy completion');
});