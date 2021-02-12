const fs = require('fs').promises;

function * read () {
  const name = yield fs.readFile('./name.txt');

  const age = yield fs.readFile(name, 'utf8');

  return age;
}

const it = read(); // 生成器返回迭代器，通过iterator的next方法来一步一步向下运行
const { value, done } = it.next();
// value是yield后的值
value.then((name) => {
  // yield的返回值是通过next方法传入的
  const { value, done } = it.next(name);
  value.then((age) => {
    const { value } = it.next(age);
    console.log(value);
  });
});