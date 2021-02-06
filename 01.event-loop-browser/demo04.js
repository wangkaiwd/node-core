console.log(1);

async function async () {
  console.log(2);
  // console.log(3)会立即执行，并且包装成一个Promise(Promise.resolve)
  // await之后的代码会在Promise.resolve(3).then(() => {console.log(4)})里的then方法的回调中执行
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
