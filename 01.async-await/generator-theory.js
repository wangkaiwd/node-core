// function
// 根据指针向下执行 + switch case 来实现
function gen$ (context) {
  // while (true) {
  switch (context.prev = context.next) {
    case 0:
      context.next = 1;
      return 1;
    case 1:
      context.next = 2;
      return 2;
    case 2:
      context.next = 3;
      return 3;
    case 3:
      context.stop();
      return 100;
  }
  // }
}

function gen () {
  const context = {
    prev: 0,
    next: 0,
    done: false,
    stop () {
      this.done = true;
    }
  };
  return {
    next () { // 每次调用next都会重新产生一个函数执行上下文
      return {
        value: gen$(context),
        done: context.done
      };
    }
  };
}

const it = gen();
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
