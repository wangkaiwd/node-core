function MyEmitter () {
  this.caches = {};
}

const NEW_LISTENER = 'newListener';
MyEmitter.prototype.on = function (name, listener) {
  if (!this.caches) {
    this.caches = {};
  }
  const cache = this.caches[name] = this.caches[name] ?? [];
  // attach listener to newListener
  if (this.caches[NEW_LISTENER] && name !== NEW_LISTENER) { // 只要添加其它事件，在将其它事件添加到内部的数组之前，触发newListener attach的监听器
    this.emit(NEW_LISTENER, name, listener);
  }
  cache.push(listener);
};
MyEmitter.prototype.emit = function (name, ...args) {
  const listeners = this.caches[name] ?? [];
  listeners.forEach(l => {
    // 用户逻辑中可能会off某一个事件，如果将数组中之前的某个事件删除，就会出现问题
    l && l(...args);
  });
};
MyEmitter.prototype.off = function (name, listener) { // 移除对应的监听器函数
  const listeners = this.caches[name] ?? [];
  // 这里不用filter要怎么实现
  listeners.filter(l => (l !== listener) && (l.cb !== listener));
};

// 可以在为once通过name来创建一个caches,然后在取消请求时，先在caches中查找，然后再在onceCaches中查找，找到一个就将其删除(防止数组塌陷设置为null)
MyEmitter.prototype.once = function (name, listener) { // 只监听一次，触发之后便会取消监听
  const innerCb = (...args) => {
    listener(...args);
    this.off(name, innerCb);
  };
  // 将最初绑定的函数记录到自己创建的函数上，用于用户手动调用off来解除绑定的listener
  innerCb.cb = listener;
  this.on(name, innerCb);
};

module.exports = MyEmitter;
