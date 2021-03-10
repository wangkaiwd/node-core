## 深入源码：手写一个`koa`

### 前言：了解`koa`

`koa`是使用`Node.js`进行服务端开发的常用框架，它帮用户封装了原生`Node.js`中`req`和`res`，使用户可以更方便的调用`API`来实现对应的功能。

`koa`的核心没有捆绑任何其它的中间件，这让它的代码体积更小、性能更高。

下面是`koa`最简单的`Hello World`例子：

```javascript
const Koa = require('koa');
// 创建Koa实例
const app = new Koa();

// 添加中间件来处理请求
app.use(async ctx => {
  // ctx.body可以设置传递客户端的响应
  ctx.body = 'Hello World';
});

// 监听端口
app.listen(3000);
```

更多关于`koa`的介绍可以查阅它的[官方代码仓库](https://github.com/koajs/koa)

下面我们将会根据上述的`Hello World`来一步步实现`Koa`的核心功能。

### 代码结构分析

从之前的`Hello World`代码中，我们可以得到如下信息：

* `Koa`是一个类，用户可以通过`new Koa`来创建一个`koa`实例
* `koa`实例上提供了`use`方法，该方法接收一个回调函数，可以用来处理请求
* `koa`实例上还提供了`listen`方法，用来监听创建服务的端口

接下来我们去看下`koa`的源代码的目录结构：
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/20210310160437.png)

主要有以下四个文件，每个文件的功能如下：

* `application`: `Koa`类，用来创建`koa`实例
* `context`: 导出一个对象，会提供一些`api`,也会代理`request`和`response`上的一些属性或方法，方便用户直接通过`ctx`来调用
* `request`: 导出一个对象，封装了`Node.js`原生`req`的方法
* `response`: 导出一个对象，封装了`Node.js`原生`res`的方法

用户在使用时会通过`package.json`中的`main`字段来引入`Application`类来创建实例：
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/20210310163112.png)

### 开始实现