const fs = require('fs');
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

rmdir(path.resolve(__dirname, 'a'), (err) => {
  if (err) {return console.log(err);}
  console.log('remove successful');
});