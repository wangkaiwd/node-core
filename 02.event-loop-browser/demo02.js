Promise.resolve().then(() => {
  console.log('then1');
  Promise.resolve().then(() => {
    console.log('then1-1');
    // 加或不加这行的执行结果不一样
    // 注意要仔细考虑这一行代码到底做了什么！
    // return new Promise((resolve,reject) => {resolve()})
    // .then的返回值要根据对应的成功或失败回调的返回值来确定
    // 如果返回的是promise，要在promise.then中再执行resolve或reject,执行下一个.then
    // 之后的.then就可以拿到resolve或reject中传递的参数，并确定之后promise的状态
    // 为了遵循ecmascript262规范，这里最终会相当于x.then().then()
    return Promise.resolve();
  }).then(() => {
    console.log('then1-2');
  });
}).then(() => {
  console.log('then2');
}).then(() => { // 先将其收集到数组中，当前一个Promise执行resolve或reject之后，才会将then中的函数放到异步任务中执行
  console.log('then3');
}).then(() => {
  console.log('then4');
});
//  主线程执行
//  then1 then1-1 then2 x.then then3 then1-2 then4
//  [then1-2, then4]
