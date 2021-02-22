## Koa

没有捆绑任何中间件

### 学习

* 通过基础的一些用法来掌握`koa`的原理
* context,response,request都是导出的对象，每创建一个新的`Application`实例，都需要一个全新的`context,response,request`，这样不同实例之间的修改对这些属性的修改不会相互干扰
* 每个请求之间也要创建单独的context,response,request
* 利用对象的`get,set`方法来封装`Node.js`的原生`req,res`(通过`this`可以获取到`req,res`,可以在`set/get`方法中对它们的使用进行简化，更方便用户使用)

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

需求1：

```javascript
console.log(ctx.req.url);
console.log(ctx.request.req.url);
console.log(ctx.request.path);
console.log(ctx.path);
```

需求2：

```javascript
console.log(ctx.body)
console.log(ctx.response.body)
```

先将字符串拼接到`ctx.response.body`上，等到所有该请求的中间件函数执行完毕后，最后通过`res.end(ctx.body)`将其返回。细节：当`ctx.body`为空时，页面返回`Not Found`

需求3：可以直接将`ctx.body`设置为流，`koa`会帮我们将`req`通过`pipe`方法写入到`ctx.body`中
> 否则如果`res.end(writeStream)`会将文件直接下载

```javascript
ctx.body = fs.createWriteStream()
```