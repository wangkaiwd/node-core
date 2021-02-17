const fs = require('fs');
const pFs = require('fs').promises;
const path = require('path');

function rmdir (dir, cb) {
  fs.stat(dir, (err, stats) => {
    if (stats.isFile()) {
      fs.unlink(dir, cb);
    } else { //目录
      fs.readdir(dir, (err, files) => {
        // 串行执行，一个完成再执行下一个
        let index = 0;

        const next = () => {
          if (index === files.length) { // 删除完所有的内容
            return fs.rmdir(dir, cb);
          }
          const file = files[index++];
          const childDir = path.join(dir, file);
          rmdir(childDir, next);
        };

        next();
      });
    }
  });
}

function pRmdir (dir) { // 最后要返回Promise
  return pFs.stat(dir).then((stats) => {
    if (stats.isFile()) {
      return pFs.unlink(dir);
    } else {
      // 删除所有的孩子
      let count = 0; // 异步的核心：通过计数器来记录回调完成的个数

      return pFs.readdir(dir).then((files) => {
        function next () {
          console.log(count, files);
          if (count === files.length) {
            return pFs.rmdir(dir);
          }
          const file = files[count++];
          const childFile = path.join(dir, file);
          return pRmdir(childFile).then(next);
        }

        return next();
      });
    }
  });
}

// 回调
// rmdir(path.resolve(__dirname, 'a'), (err) => {
//   if (err) {return console.log(err);}
//   console.log('remove successful');
// });

// Promise
pRmdir(path.resolve(__dirname, 'a')).then(() => {
  console.log('remove successful');
}).catch((err) => {
  console.log('err', err);
});