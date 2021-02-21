// context 其实就是一个对象
const context = {
  set body (value) {
    // this指向函数的调用者，这里是通过每个请求时创建的ctx来调用的
    this.res.write(value);
    // this.res.end();
  },
  // get path () { // 并不是这种写法
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

defineGetter('req', 'path');