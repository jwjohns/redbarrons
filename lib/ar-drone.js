'use strict';
var arDrone = require('ar-drone');

var client = arDrone.createClient();

module.exports = {

    takeoff: function(cb) {
        client.takeoff(cb);
    },
    land: function(cb) {
        client.land(cb);
    },
    stop: function(cb) {
        client.stop(cb);
    };
    move: function(dir, param, duration, cb) {
        client[dir](param);
        setTimeout(function() {
            client.stop();
            cb();
        }, duration);
    },
    battery: function(cb) {
        client.on('batteryChange', cb);
    }

};