## Events

* [events](https://nodejs.org/dist/latest-v14.x/docs/api/events.html#events_events)

### 继承

* Object.create
* Object.setPrototypeOf
* class extends
* [util.inherit](https://devdocs.io/node~14_lts/util#util_util_inherits_constructor_superconstructor)

### implement EventEmitter

* on
* once
  * [**manual off once
    listener**](https://github.com/wangkaiwd/node-core/blob/9e7d35fe59970d7ea6c0b3b82eb6131855e16546/05.events/demo.js#L18-L19) ([add a property for callback function](https://github.com/wangkaiwd/node-core/blob/9e7d35fe59970d7ea6c0b3b82eb6131855e16546/05.events/my-emitter.js#L37))
* emit
* [off](https://github.com/wangkaiwd/node-core/blob/9e7d35fe59970d7ea6c0b3b82eb6131855e16546/05.events/my-emitter.js#L27)
* [newListener](https://github.com/wangkaiwd/node-core/blob/9e7d35fe59970d7ea6c0b3b82eb6131855e16546/05.events/my-emitter.js#L12-L14)
