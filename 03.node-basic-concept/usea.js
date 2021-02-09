const fs = require('fs');
const vm = require('vm');
const path = require('path');

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

function Module (filename) {
  this.id = filename;
  this.path = path.dirname(filename);
  this.exports = {}; // 之后会在每个模块内，用户通过Module的实例module.exports来为其赋值
}

Module.prototype.load = function () {
  const ext = path.extname(this.id);
  Module._extensions[ext](this);
};
Module._extensions = {};

function wrapper (code) {
  return `
    (function(module,exports,require,__dirname,__filename) {
      ${code}
    })
  `;
}

Module._extensions['.js'] = function (module) {
  let code = fs.readFileSync(module.id, 'utf8');
  code = wrapper(code);
  const fn = vm.runInThisContext(code);
  // 将exports和module.exports指向同一个引用地址(堆内存)
  const exports = module.exports;
  fn.call(exports, module, exports, myRequire, module.path, module.id);
};
// 读取json文件，并通过JSON.parse处理为js对象赋值给module.exports
Module._extensions['.json'] = function (module) {
  const json = fs.readFileSync(module.id, 'utf8');
  module.exports = JSON.parse(json);
};
// 将路径处理为绝对路径 并且添加文件后缀
Module._resolveFilename = function (filename) {
  const absPath = path.resolve(__dirname, filename);
  const isExist = fs.existsSync(absPath);
  if (isExist) return absPath;
  const extensions = Reflect.ownKeys(Module._extensions);
  for (let i = 0; i < extensions.length; i++) {
    const absPathWithPostfix = absPath + extensions[i];
    if (fs.existsSync(absPathWithPostfix)) {
      return absPathWithPostfix;
    }
  }
  throw new Error('Can not find module!');
};

function myRequire (filename) {
  filename = Module._resolveFilename(filename);
  const module = new Module(filename);
  module.load();
  return module.exports;
}

const a = myRequire('./a');
console.log(a);
