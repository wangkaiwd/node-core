const EventEmitter = require('./my-emitter');
// const EventEmitter = require('events');

const events = new EventEmitter();

function onData (args) {
  console.log(args);
}

function demo01 () {
  events.on('data', onData);
  events.emit('data', [1, 2, 3]);
  events.off('data', onData);
  events.emit('data', [1, 2, 3]);
}

function demo02 () {
  events.once('data', onData);
  events.off('data', onData);
  events.emit('data', [1, 2, 3]);
  events.emit('data', [1, 2, 3]);
}

demo02();

function demo03 () {
  events.on('newListener', (name, listener) => {
    console.log('name', name);
  });
  events.on('data', () => {
    console.log('A');
  });
}

// demo03();
