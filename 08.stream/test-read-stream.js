const path = require('path');
const fs = require('fs');
const MyReadStream = require('./read-stream-implement');
const rs = new MyReadStream(path.resolve(__dirname, './readme.md'), {
  highWaterMark: 4
});

const body = [];
rs.on('data', (chunk) => {
  body.push(chunk);
});

rs.on('end', () => {
  console.log(Buffer.concat(body).toString());
});

rs.on('open', (fd) => {
  console.log('open', fd);
});

rs.on('close', () => {
  console.log('close');
});