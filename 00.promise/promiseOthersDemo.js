const Promise = require('./promise');

function finallyDemo () {
  const p = new Promise((resolve, reject) => {
    reject(1);
  });

  p.then((value) => value, (reason) => Promise.reject(reason))
    .finally(() => { // finally只是在前一个promise成功或失败后执行一段逻辑
      // 并且会将前一个promise成功或失败值通过resolve或reject传递给下一个promise .then中的回调
      console.log('hh');
    })
    .then((v) => {
      // 最后一个Promise的状态是确定的，只是没有继续通过.then来处理它的value和reason。
      // 因为要处理的逻辑已经完成了，之后的内容没有必要再处理了
      console.log(v);
    }, (r) => {console.log('reason', r);});
}

function allDemo () {
  const p1 = Promise.resolve(1);
  const p2 = Promise.reject(2);
  const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(3);
    }, 4000);
  });
  Promise.all([p1, p2, p3]).then((result) => {
    console.log('result', result);
  }, (reason) => {
    console.log('reason', reason);
  });

}

// allDemo();

function raceDemo () {
  const p1 = Promise.resolve(1);
  const p2 = Promise.reject(2);
  const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(3);
    }, 4000);
  });
  Promise.race([p1, p2, p3]).then((value) => {
    console.log(value);
  }).catch((reason) => { // 如果是成功的回调，catch中会将前一个promise then方法中成功回调包装成一个函数: (v) => v
    console.log(reason);
  });
}

// raceDemo();

function allSettledDemo () {
  const p1 = Promise.resolve(1);
  const p2 = Promise.reject(2);
  const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(3);
    }, 4000);
  });
  Promise.allSettled([p1, p2, p3]).then((result) => {
    console.log('result', result);
  });
}

allSettledDemo();
