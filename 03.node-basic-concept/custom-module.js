const path = require('path');
const fs = require('fs');
const vm = require('vm');

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
    (function(module,exports,myRequire,__dirname,__filename) {
      ${code}
    })
  `;
}

Module._cache = {};
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
  console.log('absPath', absPath, '----');
  throw new Error('Can not find module!');
};

function myRequire (filename) {
  console.log('filename', filename);
  filename = Module._resolveFilename(filename);
  // 1. 执行usea.js
  // 2. require a.js
  // 3. 执行 a.js
  // 4. require usea.js
  // 5. 执行usea.js
  if (Module._cache[filename]) {
    return Module._cache[filename].exports;
  }
  // 在更改module.exports时，也会将缓存的模块一块更新。之后再次读取相同文件，便会返回缓存中的module.exports
  const module = Module._cache[filename] = new Module(filename);
  module.load();
  return module.exports;
}

module.exports = myRequire;
