// https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout
const fs = require('fs');
// 根据性能影响，执行的顺序可能会有所不同
setTimeout(() => {
  console.log('timeout');
}, 0);

// check阶段执行
setImmediate(() => {
  console.log('immediate');
});

// 直接从poll阶段开始
fs.readFile('./readme.md', (err, data) => {
  setTimeout(() => {
    console.log('timeout2');
  }, 0);
  setImmediate(() => {
    console.log('immediate2');
  });
});

// timers只有当到等待的时间达到时，才会放到timers队列中
// 所以当时间没到时，就会先执行下面的阶段
// 而当定时器的时间设置为0时，等待的时间会被性能影响，所以可能会被跳过，在下一轮执行
//   ┌───────────────────────────┐
// ┌─>│           timers          │
// │  └─────────────┬─────────────┘
// │  ┌─────────────┴─────────────┐
// │  │     pending callbacks     │
// │  └─────────────┬─────────────┘
// │  ┌─────────────┴─────────────┐
// │  │       idle, prepare       │
// │  └─────────────┬─────────────┘      ┌───────────────┐
// │  ┌─────────────┴─────────────┐      │   incoming:   │
// │  │           poll            │<─────┤  connections, │
// │  └─────────────┬─────────────┘      │   data, etc.  │
// │  ┌─────────────┴─────────────┐      └───────────────┘
// │  │           check           │
// │  └─────────────┬─────────────┘
// │  ┌─────────────┴─────────────┐
// └──┤      close callbacks      │
//    └───────────────────────────┘