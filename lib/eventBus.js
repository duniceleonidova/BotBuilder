var Emitter = require('events').EventEmitter;

var asyncEventBus = new Emitter();
asyncEventBus.emit = function(type, details) {
    var emit = Emitter.prototype.emit.bind(this, type, details);
    setImmediate(emit);
}

module.exports = asyncEventBus;
