// function
// 根据指针向下执行 + switch case 来实现
// https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&spec=false&loose=false&code_lz=MYewdgzgLgBAZmGBeGAKAhgGgEYEpkB8MA3gFACQATgKZQCuli6A1NqQL6lx1jBQCW4GACoYAc2qJU-MjBgA3dJRjZkMAJ79qAGwAmMAIwBuUnNCQQ26gDptIMajymNWvfDCoDmAEy4TczR19AGZ_GBp6RkMABmiTdiA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Ces2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.12.15&externalPlugins=

// origin: generator.js
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
      const b = context.sent;
      console.log('b', b);
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
    sent: undefined,
    stop () {
      this.done = true;
    }
  };
  return {
    next (sent) { // 每次调用next都会重新产生一个函数执行上下文
      context.sent = sent;
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
