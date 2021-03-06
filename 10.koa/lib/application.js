const http = require('http');
const context = require('./context');
const request = require('./request');
const response = require('./response');
const Stream = require('stream');
const util = require('util');
const EventEmitter = require('events');

function Application () {
  EventEmitter.call(this);
  this.middlewares = [];
  this.context = Object.create(context);
  this.request = Object.create(request);
  this.response = Object.create(response);
}

Application.prototype = Object.create(EventEmitter.prototype);
Application.prototype.constructor = Application;

// 每次请求要创建单独的ctx,request,response
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

Application.prototype.compose = function (ctx) {
  let i = 0;

  const dispatch = () => {
    if (i === this.middlewares.length) { // 如果执行完所有的中间件函数
      return Promise.resolve(); // 最终返回value为undefined的Promise
    }
    const middleware = this.middlewares[i];
    i++;
    try {
      return Promise.resolve(middleware(ctx, dispatch));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return dispatch;
};
// 每次请求要有一个全新的上下文
// req,res的功能比较弱，还要单独封装一个ctx变量来做整合，并且为用户提供一些便捷的api
Application.prototype.handleRequest = function (req, res) {
  const ctx = this.createContext(req, res);
  res.statusCode = 404;
  // 这里会是异步函数
  // this.middlewares.forEach(m => m(ctx));
  const dispatch = this.compose(ctx);
  dispatch().then(() => {
    // 执行完函数后，手动将ctx.body用res.end进行返回
    if (typeof ctx.body === 'string' || Buffer.isBuffer(ctx.body)) {
      res.end(ctx.body);
    } else if (ctx.body instanceof Stream) {
      // 源码会直接将流进行下载，会设置: content-position响应头
      ctx.body.pipe(res);
    } else if (Object.prototype.toString.call(this) === '[object Object]') {
      res.setHeader('Content-Type', 'application/json;charset=utf8');
      res.end(JSON.stringify(ctx.body));
    } else {
      res.end('Not Found!');
    }
  }).catch((err) => {
    res.statusCode = 500;
    ctx.body = 'Server Internal Error!';
    res.end(ctx.body);
    this.emit('error', err, ctx);
  });
};
Application.prototype.listen = function (...args) {
  const server = http.createServer(this.handleRequest.bind(this));
  return server.listen(...args);
};

Application.prototype.use = function (cb) {
  this.middlewares.push(cb);
};

module.exports = Application;