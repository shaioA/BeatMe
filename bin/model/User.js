var _ = require('lodash');
var phrases = require('./phrases');

function User(socket, info){
    this.socket = socket;
    this.txt    = '';
    this.isPlayingNow = false;
}

User.prototype.isSomthing = function(){
    var self = this;

};


module.exports = User;
