const fs = require('fs').promises;
const path = require('path');
const http = require('http');
const mime = require('mime');
const PORT = 3000;
const base = 'public';
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    return res.end('NOT FOUND');
  }
  const { host } = req.headers;
  // todo: How to get full url properly?
  const fullUrl = path.join('http://' + host, req.url);
  const { pathname } = new URL(fullUrl);
  let filename = pathname;
  if (pathname === '/') {
    filename = '/index.html';
  }
  const absPath = path.join(__dirname, base, filename);
  fs.readFile(path.join(__dirname, base, filename)).then((data) => {
    res.setHeader('Content-Type', mime.getType(absPath));
    res.end(data);
  }).catch((err) => {
    res.setHeader('Content', 'text/plain');
    console.log(err);
    res.end('NOT FOUND');
  });
});

server.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});