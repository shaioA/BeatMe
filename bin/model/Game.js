var _ = require('lodash');


function Game(uuid, type, users){
    this.type = type;
    this.uuid = uuid;
    this.users = users;
    this.timer = 15;

}

Game.prototype.startGame = function(){
    var self = this;


    var timer = setInterval(function(){



        // bradcast time
        _.each(self.users,function(user){
            console.log(self.timer);
            if(user.socket) {
                user.socket.emit('timer_response', self.timer);
            }

        });

        // check if timer finish
        self.timer--;
        if(self.timer < 0){
            console.log('Time ended !');
            clearInterval(timer);
        }

    },1000);
}

module.exports = Game;
