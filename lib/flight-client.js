'use strict';

var http = require('http');

module.exports = function(cmd, params) {
    return http.get({
        host: 'localhost',
        port: 3000,
        path: '/command/' + cmd + (params && params.length > 0 ? '/' + params[0] : '')
    }, function() {
        console.log('OK');
    });
};
