var arDrone = require('ar-drone');
var express = require('express');

var client = arDrone.createClient();
var app = express();

app.get('/takeoff', function(req, res) {
    client.takeoff();
    res.end('done');
});

app.get('/land', function(req, res) {
    client.stop();
    client.land();
    res.end('done');
});

// client.takeoff();
//
// client
//     .after(2000, function() {
//         this.clockwise(1);
//     })
//     .after(2000, function() {
//         this.stop();
//         this.land();
//     });

client.on('batteryChange', console.log);

app.listen(3000);

// client.createRepl();
