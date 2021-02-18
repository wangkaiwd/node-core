const fs = require('fs');
const path = require('path');

// 思路：遍历所有的孩子，将其按照一层一层的顺序放到数组中，然后倒着删除
function rmdir (dir) {
  const queue = [dir];
  let index = 0;
  let current = undefined;
  while (current = queue[index++]) { // 直到遍历完所有内容后，queue中数组的内容是一层层展示的
    const stats = fs.statSync(current);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(current);
      files.forEach(file => {
        queue.push(path.join(current, file)); // 这里也会把文件放入到数组中
      });
    }
  }
  for (let i = queue.length - 1; i >= 0; i--) {
    const item = queue[i];
    const stats = fs.statSync(item);
    if (stats.isDirectory()) {
      fs.rmdirSync(item);
    } else {
      fs.unlinkSync(item);
    }
  }
}

rmdir(path.resolve(__dirname, 'a'));
console.log('remove complete');
