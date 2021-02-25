const http = require('http');
const fs = require('fs/promises');
const crypto = require('crypto');
const { createReadStream } = require('fs');
const path = require('path');
const { getFullUrl } = require('../shared/util');
const mime = require('mime');
const ejs = require('ejs');

class Server {
  constructor (options) {
    this.mergeOptions(options);
  }

  mergeOptions (options) {
    this.options = {
      port: 3000,
      directory: process.cwd(),
      ...options
    };
  }

  // 如果是目录要将目录渲染为列表
  handleRequest (req, res) {
    const { pathname } = new URL(getFullUrl(req));
    const { directory } = this.options;
    let absPath = '';
    if (path.isAbsolute(directory)) {
      absPath = path.join(directory, pathname);
    } else {
      absPath = path.join(__dirname, directory, pathname);
    }
    this.resolvePath(absPath, req, res)
      .catch((err) => this.handleError(err, res));
  }

  resolvePath (absPath, req, res) {
    return fs.stat(absPath)
      .then((stats) => {
        if (stats.isFile()) {
          // 不用每次都读取文件，可以使用缓存来进行优化
          return this.renderFile(absPath, req, res, stats);
        } else {
          return this.renderDir(absPath, req, res);
        }
      });
  }

  cache (absPath, req, res, stats) {
    return fs.readFile(absPath).then((data) => {
      res.statusCode = 200;
      res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toUTCString()); // 设置具体的时间
      // res.setHeader('Cache-Control', 'max-age=10');
      res.setHeader('Cache-Control', 'no-cache'); // 每次都会发请求，让服务端校验是否需要缓存
      // 返回是否需要继续读取缓存
      const ctime = stats.ctime.toUTCString();
      const ifModifiedSince = req.headers['if-modified-since'];
      const ifNoneMatch = req.headers['if-none-match'];
      res.setHeader('Last-Modified', ctime);
      // 这里要读取整个文件，正常来说会读取文件的一部分内容来做摘要
      const etag = crypto.createHash('md5').update(data).digest('base64');
      res.setHeader('Etag', etag);
      // 通过Etag实现更准确的缓存, 浏览器会携带If-None-Match
      if (ctime === ifModifiedSince) {
        return true;
      }
      if (etag === ifNoneMatch) {
        return true;
      }
    });
  }

  renderFile (absPath, req, res, stats) { // 缓存之后不会向服务端发请求，只有在强制缓存时间过去之后，才会发请求
    return new Promise((resolve, reject) => {

      // 用流来读取数据的好处，可以一点点读取，防止文件过大，淹没内存
      // 使用pipe的好处，pipe内部会控制写入的速率
      // 当写入内容超过了highWaterMark停止写入，当内存中存储的写入队列中的内容都被写入后，会emit drain事件，此时继续写入
      // 响应头要设置charset=utf-8防止出现乱码
      return this.cache(absPath, req, res, stats).then((cacheable) => {
        if (cacheable) { // 文件内容没有发生改变,index.html也会返回304,浏览器看到304便会去缓存中查找，服务端不用返回内容
          res.statusCode = 304;
          res.end(); // 返回304，直接结束本次响应，浏览器看到是304会自己去缓存中查找
          resolve();
        } else {
          const readStream = createReadStream(absPath);
          res.setHeader('Content-Type', (mime.getType(absPath) || 'text/plain') + ';charset=utf-8');
          readStream.pipe(res);
          readStream.on('error', (err) => {
            reject(err);
          });
          readStream.on('end', () => {
            resolve();
          });
        }
      });
    });
  }

  renderDir (absPath, req, res) {
    return new Promise((resolve, reject) => {
      const { pathname } = new URL(getFullUrl(req));
      fs.readdir(absPath).then((files) => {
        files = files.map(file => {
          // req.url可能会包含路径上的额外信息
          return { name: file, link: path.join(pathname, file) /* 处理为相对根目录的路径*/ };
        });
        ejs.renderFile(path.join(__dirname, '../template.ejs'), { files }, (err, str) => {
          if (err) {return reject(err);}
          res.setHeader('Content-Type', 'text/html;charset=utf-8');
          res.end(str);
          resolve();
        });
      }, reject);
    });
  }

  handleError (err, res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain;charset=utf-8');
    res.end('NOT FOUND!');
  }

  start () {
    const { port } = this.options;
    const server = http.createServer(this.handleRequest.bind(this));
    server.listen(port, () => {
      console.log(`server is listening on port ${port}`);
    });
  }
}

module.exports = Server;

// 缓存：强制缓存，在10s内不再向服务器发起请求(首页不会被强制请求)
// 设置相对时间,单位为秒
// cache-control: no-store(不存储缓存), no-cache(每次向服务器发起请求)
// 如果过了10s，文件内容还是没有发生改变，告诉浏览器继续找缓存中的文件
// 协商缓存：问一下服务器，是否需要最新的内容，如果不需要，服务器返回304状态，表示资源内容没有发生变化，找缓存即可
//          注意：当返回状态码为304时，浏览器会自动去查找缓存，即浏览器认识304
// 缓存逻辑：默认先走强制缓存，10s内不会发送请求的服务器。
// 10s后发送请求到服务器，服务器会判断文件有没有变化：
//  1. 有变化：返回最新内容，之后10s内继续走缓存
//  2. 没有变化：文件没变化，返回304即可，浏览器继续到缓存中查找文件。之后10s内还是会走缓存

// 问题：
// 服务端如何判断文件是否发生变化？
//  1. 文件的修改时间: response header: Last-Modified
//     之后客户端请求时，都会携带 If-Modified-Since请求头，时间与响应头中的Last-Modified相同
