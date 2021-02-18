const path = require('path');
const fs = require('fs/promises');

// 正常情况下会使用并行删除，因为各个文件删除之间是没有相互逻辑的
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

async function rmdir1 (dir) {
  const stats = await fs.stat(dir);
  if (stats.isFile()) {
    return await fs.unlink(dir);
  } else { // 目录
    const files = await fs.readdir(dir);
    // 并行删除: 不能用Array.prototype.forEach方法
    // https://stackoverflow.com/a/37576787/12819402
    // await 要和for ... of 一起使用
    for (const file of files) {
      await rmdir1(path.join(dir, file));
      console.log('delete', file);
    }
    console.log('delete after');
    return await fs.rmdir(dir);
  }
}

// a/b/c/d/e.js f.js
rmdir1(path.resolve(__dirname, 'a')).then(() => {
  console.log('remove successful');
});

