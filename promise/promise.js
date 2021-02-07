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
    const resolve = (value) => {
      if (this.state === PENDING) {
        this.state = RESOLVED;
        this.value = value;
        this.resolvedFns.forEach(r => r());
      }
    };
    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.reason = reason;
        this.rejectedFns.forEach(r => r());
      }
    };
    // 将函数传给executor,来让用户控制执行的时机
    executor(resolve, reject);
  }

  then (onFulfilled, onRejected) {
    if (this.state === RESOLVED) {
      setTimeout(() => {
        onFulfilled(this.value);
      });
    }
    if (this.state === REJECTED) {
      setTimeout(() => {
        onRejected(this.reason);
      });
    }
    if (this.state === PENDING) { // 等resolve或reject执行后才能确定状态
      this.resolvedFns.push(() => {
        onFulfilled(this.value);
      });
      this.rejectedFns.push(() => {
        onRejected(this.reason);
      });
    }
  }
}

module.exports = MyPromise;
