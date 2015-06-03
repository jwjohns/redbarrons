'use strict';
var fs = require('fs');
module.exports = function(client) {
    var wsCfg = {
        ssl: true,
        port: 3001,
        sslKey: __dirname + '/../certs/server.key',
        sslCert: __dirname + '/../certs/server.crt'
    };

    var processRequest = function() {
        console.log('Request received.');
    };

    var httpServ = require('https');
    var app = null;

    app = httpServ.createServer({
        key: fs.readFileSync(wsCfg.sslKey),
        cert: fs.readFileSync(wsCfg.sslCert)
    }, processRequest).listen(wsCfg.port);

    var WebSocketServer = require('ws').Server,
        wss = new WebSocketServer({
            //port: 3001
            server: app
        });

    wss.on('connection', function connection(ws) {
        console.log('Websocket connected');
        ws.on('message', function incoming(message) {
            console.log('Websocket message', message);
            client.cmd(message);
        });
    });
    client.broadcasters.push(function(data) {
        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }
        wss.clients.forEach(function each(client) {
            client.send(data);
        });
    });
    console.log('Listening on web socket: 3001');
};