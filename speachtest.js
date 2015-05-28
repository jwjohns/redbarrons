'use strict';

var speach = require('./lib/speach.js');

speach.debug = false;

speach(function(cmd, params) {
    console.log('Command', cmd, params);
});