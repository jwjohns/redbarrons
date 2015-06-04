'use strict';
var exec = require('child_process').exec;
//RS_B181682

var args = require('minimist')(process.argv, {
    alias: {
        'type': 't'
    },
    'default': {
        'type': 'rolling-spider'
    }
});



var drone = require('./lib/' + args.type + '.js');

var basicCmds = ['takeoff', 'land', 'emergency'];
var continuousCommands = ['up', 'down', 'left', 'right', 'forward', 'backward', 'clockwise', 'counterClockwise'];
var durationSpecificCommands = ['backFlip', 'frontFlip', 'leftFlip', 'rightFlip'];

var client = {
    cmd: function(cmd) {
        var parts = cmd.split('/');
        if (parts.length === 1 && basicCmds.indexOf(parts[0]) >= 0) {
            drone[parts[0]](function() {});
        } else if (parts.length === 2 && parts[0] === 'go') {
            if (continuousCommands.indexOf(parts[1]) >= 0) {
                drone.move(parts[1], 0.5, 1000, function() {
                    console.log(cmd + ' command complete');
                });
            } else if (durationSpecificCommands.indexOf(parts[1]) >= 0) {
                drone.animate(parts[1], 1000, function() {
                    console.log(cmd + ' completed');
                });
            }
        }
    },
    broadcasters: []
};

require('./lib/http-server.js')(client);
require('./lib/web-socket.js')(client);

drone.battery(function(level) {
    client.broadcasters.forEach(function each(send) {
        send({
            event: 'battery',
            'value': level
        });
    });
});
exec('open https://localhost:3000/index.html');