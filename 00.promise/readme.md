## Promise

### implement simple Promise

* basic usage
* implement then method and support chain call
  * Promise/A+
* prototype method
  * then
  * catch
  * finally
* static method
  * resolve
  * reject
  * all
  * race
  * allSettled

Test my promise whether conform Promise/A+ specification or not

### understand occasion of then execute

* [demo02](https://github.com/wangkaiwd/node-core/blob/b54a7dc560dbc4c800d282e9da8d06e9ed46d8b3/02.event-loop-browser/demo02.js)

### apply of promise

fs

* promisify
* promisifyAll
  * Reflect.ownKeys -> Object.keys

How to abort a promise?

* Promise.race