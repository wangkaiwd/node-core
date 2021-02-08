const p = new Promise((resolve, reject) => {
  reject(1);
});

p.then((value) => value, (reason) => Promise.reject(reason))
  .finally(() => { // finally只是在前一个promise成功或失败后执行一段逻辑
    // 并且会将前一个promise成功或失败值通过resolve或reject传递给下一个promise .then中的回调
    console.log('hh');
  })
  .then((v) => {
    // 最后一个Promise的状态是确定的，只是没有继续通过.then来处理它的value和reason。
    // 因为要处理的逻辑已经完成了，之后的内容没有必要再处理了
    console.log(v);
  }, (r) => {console.log('reason', r);});
