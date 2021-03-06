## 深入源码：手写一个`koa`

文章资料

* [源代码](https://github.com/wangkaiwd/node-core/blob/cf9204eec8641f85f84a508a009d492d556ddd5c/10.koa/lib/application.js)
* [`koa`代码仓库](https://github.com/koajs/koa)

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

用户在使用时会通过`package.json`中的`main`字段来引入`Application`类创建实例：
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

在`handleRequest`方法中会执行所有`app.use`中传入的回调函数，也就是`koa`中的中间件。

### 实现`context,reponse,request`

为了方便用户使用，`koa`对`handleRequest`中传入的`req,res`进行了封装，最终为用户提供了`ctx`对象。

由于对象是引用类型，为了防止对象引用之间相互修改，每个应用`Application`在实例化的时候都需要创建一个单独的`context,request,response`。

```javascript
function Application () {
  this.middlewares = [];
  // 使用Object.create通过原型链来进行取值，改值的时候只会修改自身属性
  this.context = Object.create(context);
  this.request = Object.create(request);
  this.response = Object.create(response);
}
```

在处理请求时，每次请求也都会有单独的`context,response,request`，并且它们和`Node.js`原生`req,res`的关系如下：

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

下面我们实现几个`context,request,response`中常用`api`，理解它们的代码思路:

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

之后在`context.js`中会分别代理`request,response`上对应的属性和方法：

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

`context.js`通过`__defineGetter__`和`__defineSetter__`实现了对`request`和`response`上属性的代理，这样用户便可以直接通过`ctx`来访问对应的属性和方法，少敲几次键盘。

在`koa`中，对`ctx.body`的类型也进行了处理，方便用户为客户端返回数据：

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

在上边的代码中，我们已经处理好`context,request,response`之间的关系，下面我们来实现`koa`中比较重要的功能：中间件。

`koa`中`.use`方法中传入的函数便是中间件，它接收俩个参数：`ctx`,`next`。需要注意的是，这里的`next`是一个函数，它的返回值为`promise`。

```javascript
Application.prototype.compose = function (ctx) {
  let i = 0;

  const dispatch = () => {
    if (i === this.middlewares.length) { // 如果执行完所有的中间件函数
      return Promise.resolve(); // 最终返回value为undefined的promise
    }
    const middleware = this.middlewares[i];
    i++;
    try {
      return Promise.resolve(middleware(ctx, dispatch));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  // 默认先执行第1个，然后通过用户来手动调用next来执行接下来的函数
  return dispatch();
};

Application.prototype.handleRequest = function (req, res) {
  const ctx = this.createContext(req, res);
  res.statusCode = 404;
  // 这里会是异步函数
  // this.middlewares.forEach(m => m(ctx));
  this.compose(ctx).then(() => {
    // 执行完函数后，根据不同类型来手动将ctx.body用res.end进行返回
    // some code...
  })
};
```

`compose`函数中定义了`dispatch`函数，并将`dispatch`执行后的`promise`返回。此时`dispatch`的执行会让用户传入的第一个中间件执行，中间件中的`next`参数就是这里的`dispatch`。

当用户调用`next`时，便会调用`compose`中的`dispatch`方法，此时会通过`i`来获取下一个`middlewares`数组中的中间件并执行，再将`dispatch`传递给用户，重复这个过程，直到处理完所有的中间件函数。

了解了中间件的实现逻辑后，我们来看下面的一个例子：

```javascript
const Koa = require('koa');
const app = new Koa();
const PORT = 3000;
const sleep = function (delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(); // 执行时才会异步的(微任务)执行.then中的回调
      console.log('sleep');
    }, delay);
  });
};

app.use(async (ctx, next) => {
  console.log(1);
  await next(); // next 是 promise，要等到promise执行then方法中的回调时才会执行之后代码
  console.log(2);
});

app.use(async (ctx, next) => {
  console.log(3);
  await sleep(1000); // promise.then(() => {next(); console.log(4)})
  await next();
  console.log(4);
});

app.use((ctx, next) => {
  console.log(5);
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
```

当中间中有异步逻辑时，一定要使用`await`或返回对应的`promise`。这样`Promise.resolve`便必须等到所有的`promise`都`resolved`或者`rejected`之后才会继续执行。

`koa`中间件的执行流程如下：
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/20210314002155.png)

### 错误处理

`koa`的错误处理是通过继承`events`来实现的：

```javascript
const EventEmitter = require('events');

function Application () {
  // 继承属性
  EventEmitter.call(this);
  // omit some code...
}

// 继承原型上的方法
Application.prototype = Object.create(EventEmitter.prototype);
Application.prototype.constructor = Application;

Application.prototype.handleRequest = function (req, res) {
  const ctx = this.createContext(req, res);
  res.statusCode = 404;
  // 这里会是异步函数
  // this.middlewares.forEach(m => m(ctx));
  this.compose(ctx).then(() => {
    // some code
  }).catch((err) => { // 在catch方法中处理错误
    res.statusCode = 500;
    ctx.body = 'Server Internal Error!';
    res.end(ctx.body);
    // emit error 事件，需要用户通过on('error',fn)来进行错误事件的订阅
    this.emit('error', err, ctx);
  });
};
```

在中间执行过程中如果出现了错误，那么便会返回`rejected`状态的`promise`，此时可以通过`promise`的`catch`方法来捕获错误，并通过继承自`events`的`emit`方法来通知`error`事件对应的函数执行：
> `Promise`在执行过程中如果出现错误，会通过`try{ // some code }catch(e){ reject(err) }`返回一个失败状态的`promise`

```javascript
const Koa = require('../lib/application');
const app = new Koa();
const PORT = 3000;
app.use(async (ctx, next) => {
  throw Error('I am an error message');
  console.log(1);
  await next();
});

app.use((ctx, next) => {
  ctx.body = 'Hello Koa';
});

app.on('error', (e, ctx) => {
  console.log('ctx', e);
});
app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
```

用户在使用时需要通过`on`方法来监听`error`事件，这样在中间件执行的过程中出现错误时，就会通过`emit('error')`来通知`error`绑定的函数执行，进行错误处理。

### 写在最后

本文讲解了`koa`源码中的一些核心逻辑：

* 提供`ctx`变量，为用户提供更加简洁的`api`
* 通过中间件来将一个请求过程中处理的逻辑进行拆分
* 通过监听`error`事件来进行错误处理

在了解这些知识后，我们便能更加熟练的运用`koa`来实现各种需求，也可以借鉴它的实现思路来自己实现一个类似的工具。