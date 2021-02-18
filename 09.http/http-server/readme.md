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

* package.json bin field
* npm link
* commander
  * options
  * name
  * version
  * custom help
* ejs
  * renderFile

### 问题

* commander的用法
* 目录点击跳转地址如何拼接？
* `Content-Type`后添加`charset=utf-8`是为了防止中文乱码