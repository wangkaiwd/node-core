// function
// 根据指针向下执行 + switch case 来实现
function * gen () {
  yield 1;
  yield 2;
  yield 3;
}

// 生成器执行返回迭代器
const it = gen();
console.log(it);
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
