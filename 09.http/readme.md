## Http

### 请求方法

* get
* post
* options

### 状态码

* [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

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