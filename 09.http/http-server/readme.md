## HTTP server

* 参考工具`serve`
* [commander](https://github.com/tj/commander.js/): 使`Node.js`命令行界面变得更简单

### 工具介绍

```shell
hserve -p 3000 -d public
```

* -p 指定端口
* -d 指定要静态服务器托管的目录

### 知识点

* [package.json bin field](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#bin)
* [npm link](https://docs.npmjs.com/cli/v6/commands/npm-link)
* commander
  * [options](https://github.com/tj/commander.js/#common-option-types-boolean-and-value)
  * [name](https://github.com/tj/commander.js/#usage-and-name)
  * [version](https://github.com/tj/commander.js/#version-option)
  * [custom help](https://github.com/tj/commander.js/#custom-help)
* ejs
  * renderFile
* process.cwd
* fs-extra

### 问题

* 优雅的api设计
* commander的用法
* 目录点击跳转地址如何拼接？
* `Content-Type`后添加`charset=utf-8`是为了防止中文乱码
* 路径中含有中文，`pathname`该如何处理？

### 缓存

如何引出缓存？

* 例在`index.html`中通过`link`引入`index.css`，每次都会请求`index.css`文件


* 强制缓存
  * 首页不会被缓存
  * 引用的资源被强制缓存
* Expires
  * concrete time
* Cache-Control
  * no-store
  * no-cache
  * max-age
* 协商缓存
  * response header: Last-Modified, request header: If-Modified-Since
  * response header: Etag, request header: If-None-Match
  * 服务端判断缓存文件是否发生变化

应用：

* 强制缓存：百度`logo`，可以查看`network`
  ![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/20210219143224.png)

问题：

* toUTCString

总结：

1. 浏览器向服务器发起请求
2. 服务器会设置响应头： `Cache-Control`: `max-age=10`来设置相对于请求时间需要缓存的时间; `Expires`: `new Date().toUTCString()`
   设置指定时间之前从缓存中读取内容，不再请求服务器

强制缓存在的问题：在缓存时间内，如果文件内容发生变化，还会从缓存中读取

为了能够在文件更改后，浏览器不再读取缓存中的内容，可以使用对比缓存(协商缓存)

1. 每次请求都会向服务器询问，内容是否发生更改，如果没有，返回304状态码，浏览器从缓存中读取内容。如果发生更改，服务端将最新文件返回，状态码200
2. 服务端会设置`Last-Modified`响应头，值为请求文件的最后一次修改时间。之后浏览器每次请求服务器，都会设置`If-Modified-Since`请求头，值为服务端返回的`Last-Modified`响应头的值
3. 服务端会用请求文件的最新修改时间和`If-Modified-Since`进行比对，如果相同，读取缓存文件，否则重新读取文件内容并返回

设置`Last-Modified`有如下问题：

1. 修改时间是以秒为单位的，如果修改时间较快，还会读取缓存
2. 有些文件虽然没有被修改(改完再改回来)，但是修改时间发生了改变

为了更准确的设置缓存：

1. 服务端设置`Etag`响应头，值为请求文件对应的唯一标识。之后浏览器每次请求服务器，都会设置`If-None-Match`请求头，值为服务端返回的`Etag`响应头的值
2. 之后请求再次到达服务器后，服务器会用文件新生成的`Etag`与浏览器请求时设置的请求头`If-None-Math`进行比对。相同，读取缓存；否则重新读取文件内容并返回
