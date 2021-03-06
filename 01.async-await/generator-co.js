const fs = require('fs').promises;

function * read () {
  const name = yield fs.readFile('./name.txt');
  const age = yield fs.readFile(name, 'utf8');

  return age;
}

function co (gen) {
  const it = gen();
  return new Promise((resolve, reject) => {
    function step (result) {
      const { value, done } = it.next(result);
      if (done) { // 迭代器完成
        resolve(value);
      } else { // 如果迭代器没有完成
        // 通过Promise.resolve将不是promise的内容转换为Promise
        Promise.resolve(value).then((result) => {
          step(result);
        }, reject);
      }
    }

    step();
  });

}

co(read).then((v) => {
  console.log('v', v);
}, (r) => {
  console.log('r', r);
  throw r;
});
