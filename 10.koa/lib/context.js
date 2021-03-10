// context 其实就是一个对象
const context = {
  // set body (value) {
  //   // this指向函数的调用者，这里是通过每个请求时创建的ctx来调用的
  //   this.res.write(value);
  //   // this.res.end();
  // },
  // get path () { // 不能直接设置值，需要走get方法。个人觉得这样写也可以，不过将它拆出来更加有利于模块的划分
  //   return this.request.path;
  // }
};
module.exports = context;

// 使用Object.defineProperty进行代理
// 进行了代理
function defineGetter (target, key) {
  Object.defineProperty(context, key, {
    get () {
      return this[target][key];
    }
  });
}

function defineSetter (target, key) {
  Object.defineProperty(context, key, {
    set (value) {
      this[target][key] = value;
    }
  });
}

defineGetter('request', 'path');

defineGetter('response', 'body');
defineSetter('response', 'body');