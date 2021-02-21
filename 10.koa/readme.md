## Koa

没有捆绑任何中间件

### 学习

* 通过基础的一些用法来掌握`koa`的原理
* context,response,request都是导出的对象，每创建一个新的`Application`实例，都需要一个全新的`context,response,request`，这样不同实例之间的修改对这些属性的修改不会相互干扰
* 每个请求之间也要创建单独的context,response,request

实现过程：

1. 支持`koa`官方`demo`
2. 简单看一下`koa`的源码
3. context,response,request都是导出的对象

* use
* ctx：
  * req：`Node.js`原生请求对象
  * res: `Node.js`原生响应对象
  * response: 自己封装
  * request: 自己封装
* listen