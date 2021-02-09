const a = require('./a');

// 伪代码，如果没有加文件后缀，默认会以.js, .json的顺序去查找
// const a = (function (module, exports, require, __dirname, __filename) {
//   module.exports = 'a';
//   return module.exports;
// })(module, module.exports, require, __dirname, __filename);
// 使用vm让函数执行

// 调试代码执行步骤：
// 1. Module.prototype.require ： 调用Module原型上的require
// 2. Module._load
// 3. Module._resolveFilename: 将引入的模块解析为绝对路径
// 4. new Module: 构造Module实例，上面有id,exports,path等属性
// 5. module.load: 加载模块
// 6. Module._extensions: 使用策略模式来分别处理不同后缀的文件
// 7. module._compile(compiledWrapper: 读取文件，用函数包裹读取到的字符串，并通过runInThisContext来执行)


