var _ = require('lodash');


function Game(uuid, type, users){
    this.type = type;
    this.uuid = uuid;
    this.users = users;
    this.timer = 15;
    this.winner = {};
    this.jackpot = 0;
    this.status = 'init';
    this.saying = 'When life gives you a hundred reasons to cry, show life that you have a thousand reasons to smile';

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



    // broadcast the sentence
    _.each(self.users,function(user){
        console.log(self.timer);
        if(user.socket) {
            user.socket.emit('gameInitData_push',  'When life gives you a hundred reasons to cry, show life that you have a thousand reasons to smile');
        }
    });

    self.status = 'working';
    var timer = setInterval(function(){

        // broadcast time
        _.each(self.users,function(user){
            console.log(self.timer);
            if(user.socket) {
                user.socket.emit('timer_push', self.timer);
            }
        });

        // check if timer finish
        self.timer--;
        if(self.timer < 0){
            console.log('Time ended !');

            // calculate game result
            self.status = 'end';
            self.winner = self.users[Object.keys(self.users)[0]];

            // broadcast that game over - and calculate game result
            _.each(self.users,function(user){
                if(user.socket == self.winner.socket) {
                    user.socket.emit('gameEnd_push', 'win');
                }else{
                    user.socket.emit('gameEnd_push', 'lost');
                }
            });

            clearInterval(timer);
        }

    },1000);
};

Game.prototype.calculate = function(data,socket){
    var self = this;

    // update private data
    var currentUser = self.users[socket.id];
    //
    //
    //// check if somebody win & end the game
    //if(self.saying === self.users[0].txt){
    //
    //}else  if(self.saying === self.users[1].txt){
    //
    //}


    // if not , send a feedback to users (opponent mistakes, rewords, etc... )

};


module.exports = Game;
