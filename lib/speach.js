'use strict';

var Speakable = require('speakable');

var combinedWords = {
    'takeoff': true
};

function checkCombos(cmds) {
    var combo = cmds.join('');
    if (combinedWords[combo]) {
        return [combo];
    } else {
        return cmds;
    }
}

var speach = function(onCmd) {
    var speakable = new Speakable({
        key: 'AIzaSyBdluLgm_B4s5i_ymQTJV6SsW2rVxKhbnA'
    });

    speakable.on('speechStart', function() {
        log('onSpeechStart');
    });

    speakable.on('speechStop', function() {
        log('onSpeechStop');
    });

    speakable.on('speechReady', function() {
        log('onSpeechReady');
    });

    speakable.on('error', function(err) {
        log('onError:');
        log(err);
        speakable.recordVoice();
    });

    speakable.on('speechResult', function(recognizedWords) {
        log('onSpeechResult:');
        log(recognizedWords);
        var cmd = checkCombos(recognizedWords);
        onCmd(cmd[0], cmd.slice(1));
        speakable.recordVoice();
    });

    speakable.recordVoice();
};

function log() {
    if (speach.debug) {
        console.log.apply(null, arguments);
    }
}

module.exports = speach;