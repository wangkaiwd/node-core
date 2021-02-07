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

// test2();

function test4 () {
  const p = new MyPromise((resolve, reject) => {
    resolve('ok'); // 1会作为value，被then的一个函数作为参数接收
  });
  // 先将成功和失败回调将会被收集到Promise内部的数组中
  // promise then 中回调函数的执行是异步的，为其包装了一个函数，并让它们在setTimeout中执行
  p.then((val1) => {
    return val1;
  }, (reason) => {
    console.log(reason);
  }).then((val2) => {
    console.log('val2', val2);
  });
  // 链式调用
  // 1. resolve('ok')
  // 2. 首先会将回调函数放入到内部的数组中，此时并没有执行
  // 3. resolve方法异步执行p.then中的成功回调，它是在p2的executor中执行的，这样可以在执行完毕后调用p2的resolve或者reject
  // 4. 根据p.then中回调的不同返回值判断如何执行p2.then中的回调：
  //    1. p.then中回调返回普通值，直接用它来调用p2中的resolve方法，从而异步的执行p2.then中的回调函数
  //    2. p.then中回调返回一个Promise, 要等到该Promise解决之后，会用该Promise的value或reason来执行p2中resolve或reject方法
  //       而想要等到拿到返回Promise解决之后的value或reason，就要调用该Promise的then方法，然后在then方法的回调中调用p2的resolve或reject方法
}
