const fs = require('fs');

function promisify (fn) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn(...args, (err, data) => {
        if (err) {return reject(err);}
        resolve(data);
      });
    });
  };
}

const readFile = promisify(fs.readFile);

readFile('./package.json').then((data) => {
  console.log(data.toString());
});

function promisifyAll (obj) {
  const keys = Reflect.ownKeys(obj);
  keys.forEach(key => {
    if (typeof obj[key] === 'function') {
      obj[key + 'Async'] = promisify(obj[key]);
    }
  });
}

promisifyAll(fs);
fs.readFileAsync('./package.json').then((data) => {
  console.log(data.toString());
});