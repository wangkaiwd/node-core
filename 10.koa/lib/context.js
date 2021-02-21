// context 其实就是一个对象
module.exports = {
  set body (value) {
    // this指向函数的调用者，这里是通过每个请求时创建的ctx来调用的
    this.res.write(value);
    // this.res.end();
  }
};