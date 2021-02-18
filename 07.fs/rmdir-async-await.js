const path = require('path');
const fs = require('fs/promises');

async function rmdir (dir) { // 删除传入的目录，并且返回promise
  const stats = await fs.stat(dir);
  if (stats.isFile()) {
    return await fs.unlink(dir);
  } else { // 目录
    const files = await fs.readdir(dir);
    // 并行删除: 不能用Array.prototype.forEach方法
    // https://stackoverflow.com/a/37576787/12819402
    await Promise.all(files.map(file => rmdir(path.join(dir, file))));
    return await fs.rmdir(dir);
  }
}

rmdir(path.resolve(__dirname, 'a')).then(() => {
  console.log('remove successful');
});
