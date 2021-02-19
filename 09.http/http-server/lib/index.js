const http = require('http');
const fs = require('fs/promises');
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
          return this.renderFile(absPath, req, res);
        } else {
          return this.renderDir(absPath, req, res);
        }
      });
  }

  // renderFile (absPath, req, res) {
  //   return fs.readFile(absPath).then((data) => {
  //     res.statusCode = 200;
  //     // 响应头要设置charset=utf-8防止出现乱码
  //     res.setHeader('Content-Type', (mime.getType(absPath) || 'text/plain') + ';charset=utf-8');
  //     res.end(data);
  //   });
  // }
  renderFile (absPath, req, res) {
    return new Promise((resolve, reject) => {
      // 用流来读取数据的好处，可以一点点读取，防止文件过大，淹没内存
      const readStream = createReadStream(absPath);
      // 使用pipe的好处，pipe内部会控制写入的速率
      // 当写入内容超过了highWaterMark停止写入，当内存中存储的写入队列中的内容都被写入后，会emit drain事件，此时继续写入
      readStream.pipe(res);
      readStream.on('error', (err) => {
        reject(err);
      });
      readStream.on('end', () => {
        resolve();
      });
    });
  }

  renderDir (absPath, req, res) {
    return new Promise((resolve, reject) => {
      fs.readdir(absPath).then((files) => {
        files = files.map(file => {
          return { name: file, link: path.join(req.url, file) /* 处理为相对根目录的路径*/ };
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
