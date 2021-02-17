const pFs = require('fs').promises;
const fs = require('fs');
const path = require('path');

// 理解递归的思路Promise
// 用一个简单的例子进行思考：a/b.js,c.js
function rmdirConcurrent (filename) {
  return pFs.stat(filename).then((stats) => {
    if (stats.isFile()) {
      return pFs.unlink(filename);
    } else { // 目录
      return pFs.readdir(filename).then((files) => {
        if (files.length === 0) { // 空数组
          return pFs.rmdir(filename);
        } else {
          const promises = files.map(file => { // 删除所有的孩子
            const childPath = path.join(filename, file);
            return rmdirConcurrent(childPath);
          });
          // 等到删除完所有的孩子之后，再删除自己
          // 这里values是undefined组成的数组，因为fs.unlink,fs.rmdir转换成promise api后value为undefined
          return Promise.all(promises).then((values) => pFs.rmdir(filename));
        }
      });
    }
  });
}

function rmdir (dir, cb) {
  fs.stat(dir, (err, stats) => {
    if (err) {return cb(err);}
    if (stats.isFile()) {
      fs.unlink(dir, cb);
    } else {
      fs.readdir(dir, (err, files) => {
        if (files.length === 0) {
          return fs.rmdir(dir, cb);
        }
        let count = 0;

        function next () {
          count++;
          if (count === files.length) {
            fs.rmdir(dir, cb);
          }
        }

        files.forEach(file => {
          const childFile = path.join(dir, file);
          rmdir(childFile, next); // 删除完成后要执行的回调
        });
      });
    }
  });
}

rmdir(path.resolve(__dirname, 'a'), () => {
  console.log('delete successful!');
});

// rmdirConcurrent(path.resolve(__dirname, 'a')).then(() => {
//   console.log('删除');
// }).catch((err) => {
//   console.log(err);
// });

// fs.unlink('./rf.js').then((value) => { // promise的value为undefined,默认值
//   console.log('value', value);
// });