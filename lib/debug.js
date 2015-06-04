'use strict';

function log() {
    var cmd = [];
    var cb;
    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (typeof arg === 'function') {
            cb = arg;
        } else {
            cmd.push(arg);
        }
    }
    console.log('command performed', cmd);
    if (cb) {
        cb();
    }
}

module.exports = {
    takeoff: log.bind(null, 'takeoff'),
    land: log.bind(null, 'land'),
    stop: log.bind(null, 'stop'),
    move: log.bind(null, 'move'),
    animate: log.bind(null, 'animate'),
    battery: function(cb) {
        var battery = 100;
        var interval = setInterval(function() {
            if (battery <= 0) {
                clearInterval(interval);
            }
            cb(battery);
            battery -= 2;
        }, 1000);
    }
};