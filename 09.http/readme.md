## Http

### 请求方法

* get
* post
* options

### 状态码

* [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

常用状态码：

* 200 OK
* 204 No Content
* 206 Partial Content
* 304 Not Modified
* 400 Bad Request: The server could not understand the request due to invalid syntax(请求参数错误)
* 401 Unauthorized: 客户端的身份未验证
* 403 Forbidden: 客户端的身份已验证，但是没有权限访问内容
* 404 Not Found
* 405 Method Not Allowed
* 5xx Server error response

### Usage of http module

* server = http.createServer
  * 传入的`requestListener`会自动添加到`request`事件(等同于下一条的写法，不过这种写法较为常用)
  * server.on('request',(req,res) => {})
* [server.listen](https://devdocs.io/node~14_lts/net#net_server_listen_port_host_backlog_callback):
  如果端口被占用，可以新开一个端口再创建一个服务
* [event error](https://devdocs.io/node~14_lts/net#net_class_net_server): 继承自net.Server的error事件
* http.request: 可以做中间层

请求参数解析：

* get
* post

### Http静态服务器

实现一个http静态服务器：

* 访问目录时加载目录下的`index.html`

knowledge:

* use stream for read file
* mime get file type

### 命令行工具

* 实现一个命令行工具[`serve`](https://github.com/vercel/serve) ，可以利用命令行参数结合`Node.js`来启动一个静态服务器
* 发布到`npm`
* 测试该怎么写？