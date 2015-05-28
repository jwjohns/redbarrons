var arDrone = require('ar-drone');
var express = require('express');

var client = arDrone.createClient();
var app = express();

client.config('general:navdata_demo', 'FALSE');

app.get('/command/:commandName/:commandValue?/:commandDuration?', function(req, res) {

    // Takeoff: `/command/takeoff`
    if (req.params.commandName === 'takeoff') {
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

    // Implement a duration for commands that operate continuously.
    // ex: `/command/clockwise/0.2`
    // ex: `/command/clockwise/0.2/2000`
    var continuousCommands = ['clockwise'];

    if (continuousCommands.indexOf(req.params.commandName) >= 0) {

        client[req.params.commandName](req.params.commandValue);

        if (req.params.commandDuration) {
            setTimeout(function() {
                client.stop();
                res.end('rotation complete');
            }, req.params.commandDuration);
        } else {
            res.end('rotation started');
        }
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

app.listen(3000);
