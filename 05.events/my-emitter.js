function MyEmitter () {
  this.caches = {};
}

MyEmitter.prototype.on = function (name, listener) {
  if (!this.caches) {
    this.caches = {};
  }
  const cache = this.caches[name] = this.caches[name] ?? [];
  if (this.caches['newListener']) {
    this.emit('newListener', name, listener);
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
  const index = listeners.indexOf(listener);
  listeners[index] = null;
};

MyEmitter.prototype.once = function (name, listener) { // 只监听一次，触发之后便会取消监听
  const innerCb = (...args) => {
    listener(...args);
    this.off(name, innerCb);
  };
  this.on(name, innerCb);
};

module.exports = MyEmitter;
