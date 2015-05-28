var arDrone = require('ar-drone');
var express = require('express');

var https = require('https');
var http = require('http');
var fs = require('fs');

var client = arDrone.createClient();
var app = express();

app.use(express.static('static'));

app.get('/command/:commandName', function(req, res) {

    console.log('Command Received:', req.url);

    // Takeoff: `/command/takeoff`
    if (req.params.commandName === 'takeoff') {

        console.log('got to takeoff!');

        client.takeoff(function() {
            res.end('takeoff complete');
        });
    }

    // Landing: `/command/land`
    if (req.params.commandName === 'land') {
        client.stop();
        client.land(function() {
            res.end('landing complete');
        });
    }
});

app.get('/command/go/:commandName', function(req, res) {

    // Implement a duration for commands that operate continuously.
    // ex: `/command/clockwise/`
    // ex: `/command/clockwise/2000`
    var continuousCommands = ['clockwise', 'up', 'down', 'left', 'right'];

    if (continuousCommands.indexOf(req.params.commandName) >= 0) {

        client[req.params.commandName](0.5);

        setTimeout(function() {
            client.stop();
            res.end('rotation complete');
        }, 1000);
    }

    // For commands that require a duration
    // ex: `/command/animate/yawDance/2000`
    var durationSpecificCommands = ['animate'];

    if (durationSpecificCommands.indexOf(req.params.commandName) >= 0) {

        if (!req.params.commandValue || !req.params.commandDuration) {
            res.end('Error: You need to specify a value and a duration');
            return;
        }

        client[req.params.commandName](req.params.commandValue, req.params.commandDuration);

        res.end(req.params.commandName + ' started');
    }

});

client.on('batteryChange', function(level) {
    console.log('Battery Update:', level);
});

http.createServer(app).listen(3000);
https.createServer({
    cert: fs.readFileSync(__dirname + "/certs/server.crt"),
    key: fs.readFileSync(__dirname + "/certs/server.key")
}, app).listen(3001);
