## Koa

* new Koa
* use: 回调函数
* listen

`Koa`帮我们封装了`ctx`，它上面还提供了`request`和`response`方法，这俩个属性是对`Node.js`的`req`和`res`的封装。比如提供了`request.path`属性，来方便用户获取`pathname`。

`ctx`还会代理`request`和`response`上的属性，这让用户可以很方便的通过`ctx`来直接访问`request`和`response`中封装的属性以及调用它们的方法。