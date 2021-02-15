// 用一个空间来写入10个数
const fs = require('fs');
const path = require('path');
const MyWriteStream = require('./write-stream-implement');
// const ws = fs.createWriteStream(path.resolve(__dirname, './demo.txt'), {
const ws = new MyWriteStream(path.resolve(__dirname, './demo.txt'), {
  highWaterMark: 1
});

let i = 0;

function write () {
  let flag = true;
  while (i < 10 && flag) {
    flag = ws.write(i + '');
    i++;
  }
}

write();

ws.on('drain', () => {
  console.log('drained');
  write();
});