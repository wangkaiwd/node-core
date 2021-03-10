## 深入源码：手写一个`Koa`

### 前言：了解`Koa`

`Koa`是使用`Node.js`进行服务端开发的常用框架，它帮用户封装了原生`Node.js`中`req`和`res`，使用户可以更方便的调用`API`来实现对应的功能。

`Koa`的核心没有捆绑任何其它的中间件，这让它的代码体积更小、性能更高。

下面是`Koa`最简单的`Hello World`例子：

```javascript
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```

更多关于`Koa`的介绍可以查阅它的[官方代码仓库](https://github.com/koajs/koa)

下面我们将会根据上述的`Hello World`来一步步实现`Koa`的核心功能。

### 代码结构拆解