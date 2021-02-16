//    ┌───────────────────────────┐
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
// 1. 每个阶段都有要执行的先入先出的回调函数队列
// 2. 当队列已经是耗尽的或者达到了回调函数数量的限制，事件换将会移动到下一个阶段
// 3. 阶段概览：
//    timers：setTimeout setInterval 安排的回调
//    pending callback: 执行延迟到下一个循环迭代 I/O 回调
//    idle,prepare: 只是内部使用
//    poll: 除了close callback, timers, 和 setImmediate 几乎所有的回调
//    check: setImmediate 回调这里被调用
//    close callbacks: 一些关闭回调，比如：socket.on('close',...)
// 4. 详解事件环的每一个阶段
// 5. setImmediate vs setTimeout
//    1. 主模块内执行，执行顺序被进程的性能限制
//    2. 在I/O周期内执行，会先执行setImmediate，然后再执行setTimeout
// 6.