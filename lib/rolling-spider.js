'use strict';

var RollingSpider = require('rolling-spider');

var client = new RollingSpider();
client.connect(function() {
    client.setup(function() {
        console.log('connected');
        client.startPing();
    });
});



module.exports = {
    takeoff: function(cb) {
        client.takeoff(cb);
    },
    land: function(cb) {
        client.land(cb);
    },
    stop: function(cb) {
        client.stop(cb);
    },
    move: function(dir, param, cb) {
        client[dir]({
            speed: 50,
            steps: 20
        }, cb);
    },
    animate: function(type) {
        client[type]();
    },
    battery: function(cb) {
        client.on('battery', cb);
    }
};