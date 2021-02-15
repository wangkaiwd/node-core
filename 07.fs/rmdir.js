const fs = require('fs').promises;
const path = require('path');

// 理解递归的思路Promise
// 用一个简单的例子进行思考：a/b.js,c.js
function rmdir (filename) {
  return fs.stat(filename).then((stats) => {
    if (stats.isFile()) {
      return fs.unlink(filename);
    } else { // 目录
      return fs.readdir(filename).then((files) => {
        if (files.length === 0) { // 空数组
          return fs.rmdir(filename);
        } else {
          const promises = files.map(file => { // 删除所有的孩子
            const childPath = path.join(filename, file);
            return rmdir(childPath);
          });
          // 等到删除完所有的孩子之后，再删除自己
          // 这里values是undefined组成的数组，因为fs.unlink,fs.rmdir转换成promise api后value为undefined
          return Promise.all(promises).then((values) => fs.rmdir(filename));
        }
      });
    }
  });
}

rmdir(path.resolve(__dirname, 'a')).then(() => {
  console.log('删除');
}).catch((err) => {
  console.log(err);
});

// fs.unlink('./rf.js').then((value) => { // promise的value为undefined,默认值
//   console.log('value', value);
// });