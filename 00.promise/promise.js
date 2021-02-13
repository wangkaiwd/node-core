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
      // 加了递归调用后，测试用例通过不了
      if (typeof value.then === 'function') { // value是promise,要继续进行resolve，直到它是一个普通值
        value.then((y) => {
          this.resolve(y);
        }, (r) => {
          this.reject(r);
        });
      } else {
        this.state = RESOLVED;
        this.value = value;
        this.resolvedFns.forEach(fn => fn.call(undefined));
      }
    }
  };
  reject = (reason) => {
    if (this.state === PENDING) {
      this.state = REJECTED;
      this.reason = reason;
      this.rejectedFns.forEach(fn => fn.call(undefined));
    }
  };

  // .then执行后会返回一个新的Promise
  then (onFulfilled, onRejected) {
    // 如果onFulfilled传入的不是函数，将其处理为一个返回参数的函数，这样便会将前一个Promise的value不做处理的传递给下一个Promise的then方法中的回调
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (y) => y;
    // 将onRejected中的值继续传递给下一个Promise then 中的处理错误的回调，参数为前一个Promise的reason
    onRejected = typeof onRejected === 'function' ? onRejected : (r) => { throw r;};
    const promise2 = new Promise((resolve, reject) => {
      if (this.state === RESOLVED) {
        setTimeout(() => {
          try {
            // 如果当前Promise then 执行成功，并且没有明确的返回一个失败的Promise，那么它的返回值执行下一个Promise的resolve方法
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) { // executor 或者 .then中传入的回调执行出错，Promise变为失败态
            // 如果当前的Promise then onFulfilled方法执行出错了，就会执行下一个Promise的reject方法
            reject(e);
          }
        });
      }
      if (this.state === REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
      if (this.state === PENDING) { // 等resolve或reject执行后才能确定状态
        this.resolvedFns.push(() => {
          // 这里为什么需要setTimeout?
          // 当状态为PENDING时，说明resolve和reject是异步执行的，所以onFulfilled和onRejected函数一定会被异步的执行
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
        this.rejectedFns.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    });
    return promise2;
  }

  catch (fn) {
    // 不是函数的参数将会被处理为一个函数
    // (val) => val
    return this.then(null, fn);
  }

  // 成功或失败后都会执行的逻辑，并且返回的Promise的状态是前一个Promise的状态
  finally (onFinally) {
    return this.then((v) => {
      onFinally();
      return v;
    }, (r) => {
      onFinally();
      throw r;
    });
  }

}

/**
 * 1. 如果返回值是普通值，直接resolve
 * 2. 如果返回的是promise, 会执行promise.then((y) => resolvePromise(y),(r) => reject(r))
 *    y可能还是Promise, 所以会一直将y中所有的Promise都处理完成，才会用最后一个promise的状态(可能是reject)来决定下一个Promise的状态
 *    并通过then方法，获取到promise的value或reason通过返回值传递给下一个promise
 *    new Promise((resolve,reject) => {
 *      resolve(1)
 *    }).then(() => {
 *      return new Promise((r) => {
 *        return Promise.resolve(Promise.resolve(1))
 *      })
 *    }).then(() => {
 *      // 直到把之前返回值中所有的Promise都处理完毕后，才会执行下一个.then中的回调函数
 *    })
 */
function resolvePromise (promise2, x, resolve, reject) {
  // https://github.com/promises-aplus/promises-tests/blob/4786505fcb0cafabc5f5ce087e1df86358de2da6/lib/tests/2.3.1.js#L14-L21
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle!'));
  }
  // && 优先级 高于 ||
  if (x !== null && typeof x === 'object' || typeof x === 'function') { // Promise thenable
    // 2.3.3.3.3：https://github.com/promises-aplus/promises-tests/blob/4786505fcb0cafabc5f5ce087e1df86358de2da6/lib/tests/2.3.3.js#L357
    let called = false;
    try {
      const then = x.then;
      if (typeof then === 'function') {
        then.call(x, (y) => {
          if (called) {return;}
          called = true;
          resolvePromise(promise2, y, resolve, reject);
        }, (r) => {
          if (called) {return;}
          called = true;
          reject(r);
        });
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) {return;}
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

MyPromise.resolve = function (value) {
  return new MyPromise((resolve) => {
    resolve(value); // resolve内部也会调用reject: https://github.com/wangkaiwd/js-deep/blob/4b1557ac406db3b9d384280bac42c0fddf245103/advanced/async-2/promiseOthers.js#L19
  });
};

MyPromise.reject = function (reason) {
  return new MyPromise((resolve, reject) => {
    reject(reason);
  });
};

MyPromise.all = function (promises) {
  return new MyPromise((resolve, reject) => {
    const result = [];
    let count = 0;
    for (let i = 0; i < promises.length; i++) { // 这里的i不能决定执行的是第几个
      // 这里需要注意：Promise.resolve如果处理的是一个失败状态的Promise的话
      // 当使用let时，浏览器会自己帮我们创建一个函数，并将i作为参数传入，保证函数中用到的时当前遍历时传入的i
      // 具体可以查看babel的转换过程
      const promise = Promise.resolve(promises[i]);
      promise.then((value) => {
        count++;
        // i是获取的当前作用域中的i
        // 每次循环时都会开辟一个单独的作用域来处理逻辑
        result[i] = value;
        if (count === promises.length) {
          resolve(result);
        }
      }, (reason) => { // 有一个拒绝就直接让下一个promise也处于拒绝状态
        reject(reason);
      });
    }
  });
};
// 数组中最先成功或失败的Promise作为之后的Promise的状态
MyPromise.race = function (promises) {
  return new MyPromise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      // 这样可以将不是Promise的内容也都统一处理为Promise,防止调用.then方法出错
      const promise = Promise.resolve(promises[i]);
      promise.then((value) => { // 这里没有传失败的回调函数，回将其包装成一个函数，并将错误抛给下一个promise
        resolve(value);
      }).catch((reason) => {
        reject(reason);
      });
    }

  });
};

// 返回一个成功的promise，里面包含所有传入的promise成功或失败的信息
MyPromise.allSettled = function (promises) {
  return new MyPromise((resolve, reject) => {
    const result = [];
    let count = 0;
    for (let i = 0; i < promises.length; i++) {
      const promise = Promise.resolve(promises[i]);
      promise.then((value) => {
        count++;
        result[i] = { status: 'resolved', value };
        if (count === promises.length) {
          resolve(result);
        }
      }, (reason) => {
        count++;
        result[i] = { status: 'rejected', reason };
      });
    }
  });
};

// module.exports = MyPromise;

MyPromise.deferred = function deferred () {
  const defer = {};
  defer.promise = new MyPromise((resolve, reject) => {
    defer.resolve = resolve;
    defer.reject = reject;
  });
  return defer;
};

module.exports = MyPromise;