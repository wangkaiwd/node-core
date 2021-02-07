const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';

class MyPromise {
  constructor (executor) {
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.resolvedFns = [];
    this.rejectedFns = [];
    // 将函数传给executor,来让用户控制执行的时机
    try {
      executor(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }

  resolve = (value) => {
    if (this.state === PENDING) {
      this.state = RESOLVED;
      this.value = value;
      this.resolvedFns.forEach(r => r());
    }
  };
  reject = (reason) => {
    if (this.state === PENDING) {
      this.state = REJECTED;
      this.reason = reason;
      this.rejectedFns.forEach(r => r());
    }
  };

  // .then执行后会返回一个新的Promise
  then (onFulfilled, onRejected) {
    return new Promise((resolve, reject) => {
      if (this.state === RESOLVED) {
        setTimeout(() => {
          try {
            // 如果当前Promise then 执行成功，并且没有明确的返回一个失败的Promise，那么它的返回值执行下一个Promise的resolve方法
            const r = onFulfilled(this.value);
          } catch (e) { // executor 或者 .then中传入的回调执行出错，Promise变为失败态
            // 如果当前的Promise then onFulfilled方法执行出错了，就会执行下一个Promise的reject方法
            reject(e);
          }
        });
      }
      if (this.state === REJECTED) {
        setTimeout(() => {
          try {
            const r = onRejected(this.reason);
          } catch (e) {
            reject(e);
          }
        });
      }
      if (this.state === PENDING) { // 等resolve或reject执行后才能确定状态
        this.resolvedFns.push(() => {
          try {
            const r = onFulfilled(this.value);
          } catch (e) {
            reject(e);
          }
        });
        this.rejectedFns.push(() => {
          try {
            const r = onRejected(this.reason);
          } catch (e) {
            reject(e);
          }
        });
      }
    });
  }
}

module.exports = MyPromise;
