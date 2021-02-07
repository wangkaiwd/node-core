const MyPromise = require('./promise');

function test1 () {
  // const MyPromise = Promise;
  const p = new MyPromise((resolve, reject) => { //
    console.log(0);
    resolve(1); // 1会作为value，被then的一个函数作为参数接收
    console.log(2);
  });
  console.log(3);

  // then方法中的回调会异步执行，其它内容都是同步执行
  // 等到Promise的状态发生改变后才会执行
  p.then((value) => {
    console.log(value);
  }, (reason) => {
    console.log(reason);
  });

  console.log(4);
}

function test2 () {
  const p = new MyPromise((resolve, reject) => {
    console.log(1);
    setTimeout(() => {
      resolve('ok'); // 1会作为value，被then的一个函数作为参数接收
    }, 1000);
    console.log(2);
  });
  // 先将成功和失败回调将会被收集到Promise内部的数组中
  p.then((value) => {
    console.log(value);
  }, (reason) => {
    console.log(reason);
  });
  console.log(3);
}

test2();
