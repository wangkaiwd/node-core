const fs = require('fs');
const path = require('path');
// fs.copyFile

// fs.copyFile(path.resolve(__dirname, './basic-usage.js'), path.resolve(__dirname, './final.js'), (err) => {
//   if (!err) {console.log('copy success');}
// });

// 文件超过64k时，直接将所有文件内容读取出来再写入到另一个文件中，会有性能问题
// 可以写一点读一点
const buffer = Buffer.alloc(3);// 字节
fs.open(path.resolve(__dirname, './basic-usage.js'), 'r', (err, rfd) => {
  fs.read(rfd, buffer, 0, buffer.length, 0, (err, bytesRead) => {
    // 将指定文件指定位置的内容读取出来，并写到buffer中
    fs.open(path.resolve(__dirname, './demo.js'), 'w', (err, wfd) => {
      fs.write(wfd, buffer, 0, buffer.length, 0, (err, written) => {
        console.log('written', written);
        fs.close(rfd, (err) => {if (err) {console.log(err);}});
        fs.close(wfd, () => {if (err) {console.log(err);}});
      });
    });
  });
});