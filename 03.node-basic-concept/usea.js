const a = require('a');

// 伪代码，如果没有加文件后缀，默认会以.js, .json的顺序去查找
// const a = (function (module, exports, require, __dirname, __filename) {
//   module.exports = 'a';
//   return module.exports;
// })(module, module.exports, require, __dirname, __filename);
// 使用vm让函数执行
