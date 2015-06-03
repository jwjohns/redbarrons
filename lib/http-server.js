'use strict';
var express = require('express');

var https = require('https');
var fs = require('fs');

module.exports = function(client) {
    var app = express();

    app.use(express.static('static'));

    app.get('/command/:commandName', function(req, res) {
        console.log('Command Received:', req.url);
        var cmd = req.params.commandName;
        client.cmd(cmd);
        res.end(cmd + ' complete');
    });

    app.get('/command/go/:commandName', function(req, res) {
        console.log('Command Received:', req.url);
        var cmd = 'go/' + req.params.commandName;
        client.cmd(cmd);
        res.end(cmd + ' complete');
    });

    https.createServer({
        cert: fs.readFileSync(__dirname + '/../certs/server.crt'),
        key: fs.readFileSync(__dirname + '/../certs/server.key')
    }, app).listen(3000);
    console.log('Listening on https: 3000');
};