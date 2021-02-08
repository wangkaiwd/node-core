let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('ok');
  }, 3000);
});

// 不要Promise成功的结果了,直接让Promise进行入rejected状态
function wrap (promise) {
  let abort;
  const promise2 = new Promise((resolve, reject) => {
    abort = reject;
  });
  // 创建一个不会resolve的Promise,并且可以手动调用abort来拒绝Promise2
  // 由于调用了race，只会处理最先解决或拒绝的Promise
  const p = Promise.race([promise, promise2]);
  p.abort = abort;
  return p;
}

p1 = wrap(p1);
p1.then((value) => {
  console.log(value);
}).catch((err) => {
  console.log(err);
});

setTimeout(() => {
  // 2秒后终止Promise
  p1.abort('reject');
}, 2000);
