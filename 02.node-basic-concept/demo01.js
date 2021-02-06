// 顶层的this不是global，而是module.exports
// node.js实现模块化的时候，将文件内容放到了一个函数中，并通过call将this指向了module.exports
// 最后将module.exports 作为返回值返回
console.log(this);

function a () {
  // global
  console.log(this);
}

a();
