'use strict';

var speach = require('./lib/speach.js');
var client = require('./lib/flight-client.js');

speach.debug = process.argv[2] || false;

speach(function(cmd, params) {
    console.log('Command', cmd, params);
    client(cmd, params);
});
