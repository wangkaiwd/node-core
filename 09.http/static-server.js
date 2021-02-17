const fs = require('fs/promises');
const { createReadStream } = require('fs');
const path = require('path');
const http = require('http');
const mime = require('mime');
const PORT = 3000;
const base = 'public';

// express method: https://github.com/expressjs/express/blob/master/lib/request.js#L306
function getProtocol (req) {
  return req.socket.encrypted ? 'https' : 'http';
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    res.statusCode = 404;
    return res.end('NOT FOUND');
  }
  const { host } = req.headers;
  const fullUrl = path.join(getProtocol(req) + '://' + host, req.url);
  const { pathname } = new URL(fullUrl);
  let filename = pathname;
  if (pathname === '/') {
    filename = '/index.html';
  }
  const absPath = path.join(__dirname, base, filename);
  // 当文件过大时，可以使用流来读取文件并将它返回给客户端
  // fs.readFile(path.join(__dirname, base, filename)).then((data) => {
  //   res.setHeader('Content-Type', mime.getType(absPath));
  //   res.end(data);
  // }).catch((err) => {
  //   res.setHeader('Content-Type', 'text/plain');
  //   console.log(err);
  //   res.statusCode = 404;
  //   res.end('NOT FOUND');
  // });
  const readStream = createReadStream(absPath);
  res.setHeader('Content-Type', mime.getType(absPath));
  readStream.pipe(res);
  readStream.on('error', (err) => {
    console.log('err', err);
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 404;
    res.end('NOT FOUNT');
  });
});

server.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});