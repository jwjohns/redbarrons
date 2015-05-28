var arDrone = require('ar-drone');
var express = require('express');

var client = arDrone.createClient();
var app = express();

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

    // Continuous Rotation: `/command/rotate/0.5`
    // Finite Rotation: `/command/rotate/0.5/5000`
    if (req.params.commandName === 'rotate') {

        if (!req.params.commandValue) {
            res.end('Error: You need to specify a speed');
            return;
        }

        client.clockwise(req.params.commandValue);

        if (req.params.commandDuration) {
            setTimeout(function(){
                client.stop();
                res.end('rotation complete');
            }, req.params.commandDuration);
        } else {
            res.end('rotation started');
        }
    }

});

client.on('batteryChange', function(level) {
    console.log('Battery Update:', level);
});

app.listen(3000);
