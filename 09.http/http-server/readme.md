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
  * 服务端判断缓存文件是否发生变化

应用：

* 强制缓存：百度`logo`，可以查看`network`
  ![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/20210219143224.png)
