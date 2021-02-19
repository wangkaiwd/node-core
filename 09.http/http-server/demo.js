// 通过文件生成唯一md5标识
// md5：摘要算法
// 特点：
// 1. 俩段不同的内容，摘要出的结果长度相同
// 2. 传入的内容稍有不同，就会产生完全不同的结果(雪崩效应)。传入的内容相同，结果相同
// 3. md5不可逆

// 缺点：
//  读取很大的文件然后对其进行摘要算法会耗费性能
const crypto = require('crypto');
const fs = require('fs');
const data = fs.readFileSync('./readme.md');
const hash = crypto.createHash('md5')
  .update(data)
  .digest('base64');

const hash1 = crypto.createHash('md5')
  .update('1234')
  .digest('base64');
const hash2 = crypto.createHash('md5')
  .update('12345')
  .digest('base64');
console.log(hash); // 输出base64的长度是相同的
console.log(hash1);
console.log(hash2); // 内容只有一点不同，但是结果完全不同
