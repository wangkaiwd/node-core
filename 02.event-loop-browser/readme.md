## 浏览器事件环

* 宏任务
* 微任务

执行顺序：  
先执行执行栈中代码 -> 清空所有微任务 -> 重新渲染页面(不是每次都执行) -> 一个一个执行宏任务

> 定时器会等到执行时间到达时，才会放到宏任务队列中

### 进程和线程

* 计算机里调度任务和分配任务的单位是进程
* 进程中包含着很多线程
* 例：浏览器是一个多进程模型
  * 每个`tab`都是一个进程
  * 主进程: 用户界面
  * **渲染进程**：浏览器内核，js，ui渲染
  * 请求、网络进程
  * 插件进程

渲染进程：

* `js`的主线程是单线程的
* `ui`渲染和`js`共用线程(相互阻塞)
* 事件、定时器、ajax都会单独开启线程，并不是共用主线程
* 宏任务：宿主环境提供的异步方法
* 微任务：语言本身提供的异步方法

### reference materials

* [Event loop: microtasks and macrotasks](https://javascript.info/event-loop)

[Summary](https://javascript.info/event-loop#summary):  
A more detailed event loop algorithm(though still simplified compared to
the [specification](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model))

1. Dequeue and run the oldest task from the macrotask queue(e.g. `script`)
2. Execute all microtasks: While the microtask queue is not empty: Dequeue and run the oldest microtask
3. Render change if any
4. If the macrotask queue is empty, wait till a macrotask appears
5. Go to steps 1