var _ = require('lodash');


function Game(uuid, type, users){
    this.type = type;
    this.uuid = uuid;
    this.users = users;
    this.timer = 15;
    this.status = 'init';

}



Game.prototype.startGame = function(){
    var self = this;

    // send to all that game start
    // broadcast time
    _.each(self.users,function(user){
        console.log(self.timer);
        if(user.socket) {
            console.log('sending to members that game starting , and they need to switch page')
            user.socket.emit('pickedMember_response', self.uuid);
        }
    });




    self.status = 'working';
    var timer = setInterval(function(){

        // broadcast time
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
            self.status = 'end';
            clearInterval(timer);
        }

    },1000);
};


module.exports = Game;
