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

首先我们来实现`Application`文件中的相关逻辑，让它可以支持如下代码的运行：

```javascript
const Koa = require('koa');
const app = new Koa();

// 使用Node.js原生的处理请求的方法
app.use((req, res) => {
  res.end('Hello World')
});

// 监听端口
app.listen(3000);
```

`Application`中的代码如下：

```javascript
const http = require('http');
const context = require('./context');
const request = require('./request');
const response = require('./response');
const Stream = require('stream');
const EventEmitter = require('events');

function Application () {
  this.middlewares = [];
}

Application.prototype.handleRequest = function (req, res) {
  this.middlewares.forEach(m => m(req, res));
  res.end();
};

Application.prototype.listen = function (...args) {
  const server = http.createServer(this.handleRequest.bind(this));
  return server.listen(...args);
};

Application.prototype.use = function (cb) {
  this.middlewares.push(cb);
};

module.exports = Application;
```

`Application`的`listen`方法会通过`Node.js`的`http`模块来创建一个服务器，并且会最终调用`server.listen`通过`...args`来将所有参数传入。这样`Application`
的实例在调用`listen`时便需要传入和`server.listen`相同的参数。

在`handleRequest`方法中会执行所有`app.use`中传入的回调函数。

### 实现`context,reponse,request`

为了方便用户使用，`koa`对`handleRequest`中传入的`req,res`进行了封装，最终为用户提供了`ctx`对象。

为了防止对象引用之间的修改，每个应用`Application`在实例化的时候都需要创建一个单独的`context,request,response`。

```javascript
function Application () {
  this.middlewares = [];
  // 使用Object.create通过原型链来进行取值，改值的时候只会修改自身属性
  this.context = Object.create(context);
  this.request = Object.create(request);
  this.response = Object.create(response);
}
```

在处理请求时，每次请求都会有单独的`context,response,request`，并且它们和`Node.js`原生`req,res`的关系如下：

```javascript
Application.prototype.createContext = function (req, res) {
  // 这里访问属性时会通过2层原型链来查找
  const ctx = Object.create(this.context); // 通过原型来继承context上的方法
  const request = Object.create(this.request);
  const response = Object.create(this.response);
  ctx.request = request;
  ctx.response = response;
  ctx.response.req = ctx.request.req = ctx.req = req;
  ctx.response.res = ctx.request.res = ctx.res = res;
  return ctx;
};
```

这样用户可以通过`ctx.req,ctx.request.req,ctx.response.req`和`ctx.res,ctx.request.res,ctx.response.res`来调用`Node.js`原生的`req,res`。

在`handleRequest`中会通过`createContext`来创建`ctx`对象，作为回调函数参数传递给用户：

```javascript
// req,res的功能比较弱，还要单独封装一个ctx变量来做整合，并且为用户提供一些便捷的api
Application.prototype.handleRequest = function (req, res) {
  const ctx = this.createContext(req, res);
  // 这里会是异步函数
  this.middlewares.forEach(m => m(ctx));
  res.end();
};
```

这里实现几个`context,request,response`的常用`api`:

* `ctx.request.path`
* `ctx.response.body`
* `ctx.path`
* `ctx.body`

```javascript
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  console.log(ctx.request.path)
  console.log(ctx.path)
  ctx.body = 'hello'
  ctx.response.body += 'world'
});

app.listen(3000);
```

在`request.js`中添加如下代码来让它支持`path`属性：

```javascript
const url = require('url');
module.exports = {
  get path () {
    // 用户通过ctx.request.path来调用，所以this是ctx.request,可以通过ctx.request.req来获取Node.js原生的req对象
    const { pathname } = url.parse(this.req.url);
    return pathname;
  }
};
```

在`response.js`中添加如下代码来支持`body`属性：

```javascript
module.exports = {
  set body (val) { // ctx.response.body, this => ctx.response
    if (val == null) {return;}
    // 设置body后将状态码设置为200
    this.res.statusCode = 200;
    this._body = val;
  },
  get body () { // 返回的是ctx.response上的_body,并不是当前对象中定义的_body
    return this._body;
  }
};
```

之后在`context.js`中会分别代理`request,response`上的属性和方法：

```javascript
const context = {};
module.exports = context;

// 相当于使用Object.defineProperty设置get和set方法
function defineGetter (target, key) {
  context.__defineGetter__(key, function () {
    return this[target][key];
  });
}

function defineSetter (target, key) {
  context.__defineSetter__(key, function (value) {
    this[target][key] = value;
  });
}

defineGetter('request', 'path');

defineGetter('response', 'body');
defineSetter('response', 'body');
```

`context.js`通过`Object.defineProperty`中的`get,set`方法实现了对`request`和`response`上属性的代理，这样用户便可以直接通过`ctx`来访问对应的属性和方法，少敲几次键盘。

在`koa`中，对`ctx.body`的类型进行处理，方便用户为客户端返回数据：

```javascript
Application.prototype.handleRequest = function (req, res) {
  const ctx = this.createContext(req, res);
  // 状态码默认为404，在为ctx.body设置值后设置为200
  res.statusCode = 404;
  // 这里会是异步函数
  this.middlewares.forEach(m => m(ctx));
  // 执行完函数后，手动将ctx.body用res.end进行返回
  if (typeof ctx.body === 'string' || Buffer.isBuffer(ctx.body)) {
    res.end(ctx.body);
  } else if (ctx.body instanceof Stream) { // 流
    // 源码会直接将流进行下载，会设置: content-position响应头
    ctx.body.pipe(res);
  } else if (typeof ctx.body === 'object' && ctx.body !== null) { // 
    res.setHeader('Content-Type', 'application/json;charset=utf8');
    res.end(JSON.stringify(ctx.body));
  } else { // null,undefined
    res.end('Not Found');
  }
};
```

* Buffer | String: 通过`res.end`将`ctx.body`返回给客户端
* Stream: 会将可读流通过`pipe`方法写入到可写流`res`中返回给客户端，需要用户来手动指定对应请求头的`Content-Type`
* Object: 通过`JSON.stringify`将对象转换为`JSON`字符串返回

如果`body`没有设置值或者设置值为`null`或`undefined`将返回客户端`Not Found`，响应状态码为`404`

### 实现中间件逻辑