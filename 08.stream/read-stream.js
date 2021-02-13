const fs = require('fs');
const readStream = fs.createReadStream('./basic-usage.js', {
  flags: 'r', // 文件系统标识，默认为r
  encoding: null, // 文件编码
  fd: null, // file descriptor
  mode: 0o666, // file permission
  autoClose: true,
  emitClose: false,
  // start: 0,
  // end: Infinity,
  // highWaterMark: 64*1024
  // fs: {}, By providing fs option, it is possible to override the corresponding `fs` implementations for `open`,`read`,`write`,`close`.When providing the `fs` option, overrides for `open`, `read`, and `close` is required
});