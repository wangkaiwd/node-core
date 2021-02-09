setTimeout(() => {
  console.log(1);
});

Promise.resolve().then(() => {
  console.log(2);
});

process.nextTick(() => { // 主线程代码执行完毕后会立即执行，会有一个单独的队列来存储，之后才会执行微任务和宏任务队列
  console.log(3);
});
