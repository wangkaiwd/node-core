## Cookie

* 服务器发送到用户`Web`浏览器的一小片数据
* 浏览器会存储`cookie`并且结合之后的请求发送回同一个服务器
* `cookie`一般用于告诉服务器俩个请求来自于同一个浏览器，如：保持用户登录
* `cookie`为无状态的`HTTP`协议记住了状态信息

`session`:

* `session`是基于`cookie`的，它只是一个存储在服务器的对象，需要通过唯一标识来获取`session`中的信息，而这个唯一标识也就是`sessionId`是通过`cookie`来发送的

### 创建`cookie`

### `cookie`的选项
* Expires
* Max-age