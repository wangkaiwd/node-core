console.log(1);

async function async () {
  console.log(2);
  // console.log(3)会立即执行，并且包装成一个Promise(Promise.resolve)
  // await之后的代码会在Promise.resolve(3).then(() => {console.log(4)})里的then方法的回调中执行
  // Promise.resolve(console.log(3)).then(() => {console.log(4)})
  // await之后如果是同步代码，会通过Promise.resolve()包装成异步代码
  // await之后的代码会在执行后将内容直接返回，而它之后的代码会在异步Promise处理完成后，在它的.then方法中进行处理
  await console.log(3);
  console.log(4);
}

setTimeout(() => {
  console.log(5);
});

const promise = new Promise((resolve, reject) => {
  console.log(6);
  resolve(7);
});

promise.then((res) => {
  console.log(res);
});

async();

console.log(8);