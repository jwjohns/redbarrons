'use strict';

var http = require('http');

module.exports = function(cmd, params) {
    return http.get({
        host: 'localhost',
        port: 3000,
        path: '/command/' + cmd + (params && params.length > 0 ? '/' + params[0] : '')
    }, function(response) {
        var str = '';
        response.on('data', function(chunk) {
            str += chunk;
        });

        response.on('error', function(err) {
            console.log('err', err);
        });

        response.on('end', function() {
            console.log(str);
        });
    });
};
