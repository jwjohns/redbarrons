'use strict';

// var arDrone = require('ar-drone');
var express = require('express');

var https = require('https');
var fs = require('fs');

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
//var drone = require('./lib/debug.js');
var app = express();

app.use(express.static('static'));

app.get('/command/:commandName', function(req, res) {

    console.log('Command Received:', req.url);

    // Takeoff: `/command/takeoff`
    if (req.params.commandName === 'takeoff') {

        console.log('got to takeoff!');

        drone.takeoff(function() {});

        res.end('takeoff complete');
    } else if (req.params.commandName === 'land') {
        // Landing: `/command/land`

        drone.land(function() {});

        res.end('landing complete');
    } else {
        res.end('unkowne command');
    }
});

app.get('/command/go/:commandName', function(req, res) {

    console.log('Go command Received:', req.url);
    // Implement a duration for commands that operate continuously.
    // ex: `/command/clockwise/`
    // ex: `/command/clockwise/2000`
    var continuousCommands = ['up', 'down', 'left', 'right', 'forward', 'backward', 'clockwise', 'counterClockwise'];

    if (continuousCommands.indexOf(req.params.commandName) >= 0) {

        res.end(req.params.commandName + ' command complete');
        drone.move(req.params.commandName, 0.5, 1000, function() {
            console.log(req.params.commandName + ' command complete');
        });

    }

    // For commands that require a duration
    // ex: `/command/go/backFlip`
    var durationSpecificCommands = ['backFlip', 'frontFlip', 'leftFlip', 'rightFlip'];

    if (durationSpecificCommands.indexOf(req.params.commandName) >= 0) {

        drone.animate(req.params.commandName, 1000, function() {
            console.log(req.params.commandName + ' completed');
        });
        res.end(req.params.commandName + ' command complete');
    }

});

drone.battery(function(level) {
    console.log('Battery Update:', level + '%');
});

https.createServer({
    cert: fs.readFileSync(__dirname + '/certs/server.crt'),
    key: fs.readFileSync(__dirname + '/certs/server.key')
}, app).listen(3000);
console.log('listening');