const http = require('http');

function Application () {
  this.middlewares = [];
}

// req,res的功能比较弱，还要单独封装一个ctx变量来做整合
Application.prototype.handleRequest = function (req, res) {
  this.middlewares.forEach(m => m(req, res));
  res.end();
};
Application.prototype.listen = function (...args) {
  const server = http.createServer(this.handleRequest.bind(this));
  server.listen(...args);
};

Application.prototype.use = function (cb) {
  this.middlewares.push(cb);
};

module.exports = Application;