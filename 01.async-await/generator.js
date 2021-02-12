function * gen () {
  yield 1;
  yield 2;
  yield 3;
  return 100;
}

// 生成器执行返回迭代器
const it = gen();
console.log(it);
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
// { value: 1, done: false }
// { value: 2, done: false }
// { value: 3, done: false }
// { value: 100, done: true }
