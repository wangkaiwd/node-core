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
// 原生koa:必须设置请求头才会将其作为`html`字符串返回，否则会直接下载
ctx.set('Content-Type', 'text/html')
ctx.body = fs.createWriteStream()
```

* [`Content-Type: Content-Position`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#examples)

需求4：`ctx.body`支持返回`JSON`对象：

```javascript
ctx.body = { name: '张三' }
```

### `koa`的中间件

用`Promise`来处理通过`use`传入的中间件函数:

* 几个不用`await`关键字的代码执行`demo`

洋葱模型：

* 一定要在`next`前加`await`，否则下一个中间件中有异步逻辑，就会让`next`下面的逻辑先执行

### 中间件的作用

在使用和理解一些常用中间件的原理后将其进行整理即可

### 实现`koa`的常用中间件

> 查看源码的具体实现

* 递归
* `Promise`

问题：

* 如何在一个中间件内多次调用`next`时报错？

* [middleware execute diagram](https://excalidraw.com/#json=5151770326073344,CpXp9RscMfx7dlVXnOp3kQ)

#### body-parser

需求：通过`get`请求`/login`返回登录表单，填写用户名和密码后点击登录，会发送`post`请求，解析请求数据

分别处理不同的请求头：

* `application/x-www-form-urlencoded`，可以通过`querystring`将其解析为对象
* `application/json`，通过`JSON.parse`进行解析
* `multipart/form-data`，文件上传

请求头中会携带`boundary`表示参数之间的分界线：

```text
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryUYwLSWdutXxygAz4
```

![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/20210307174315.png)

通过`multipart/form-data`传来的文本和其它表单参数组成的内容，如果是图片，将`Buffer`转换为字符串会出现乱码。

多个图片也会被分界线分割，方便一个一个进行解析

```text
------WebKitFormBoundaryob0tB4JxRfBPwfZg
Content-Disposition: form-data; name="username"

1
------WebKitFormBoundaryob0tB4JxRfBPwfZg
Content-Disposition: form-data; name="password"

a
------WebKitFormBoundaryob0tB4JxRfBPwfZg
Content-Disposition: form-data; name="file"; filename="english-notes copy.txt"
Content-Type: text/plain

characteristic: 特征
convoluted: 冗长费解的
profit: 盈利；利润
cognitive: 认知的；认识的
defend: 捍卫；守卫
status: 地位；
inertia: 惯性
mutually: 互相地
pillar: 支柱
pretend: 假装；伪装
precedence: 优先级
the other way around: 反过来
doodle: 涂鸦
embarrassed: 尴尬的；窘迫的
breadth: 广度
------WebKitFormBoundaryob0tB4JxRfBPwfZg
Content-Disposition: form-data; name="file"; filename="english-notes.txt"
Content-Type: text/plain

characteristic: 特征
convoluted: 冗长费解的
profit: 盈利；利润
cognitive: 认知的；认识的
defend: 捍卫；守卫
status: 地位；
inertia: 惯性
mutually: 互相地
pillar: 支柱
pretend: 假装；伪装
precedence: 优先级
the other way around: 反过来
doodle: 涂鸦
embarrassed: 尴尬的；窘迫的
breadth: 广度

------WebKitFormBoundaryob0tB4JxRfBPwfZg--
```

![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/20210307174638.png)

### 图例
* [koa middleware](https://excalidraw.com/#json=6589784889753600,wtoI7ODTK1OjcNWIpRuPRg)
