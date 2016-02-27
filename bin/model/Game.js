var _ = require('lodash');


function Game(uuid, type, users){
    this.type = type;
    this.uuid = uuid;
    this.users = users;
    this.timer = 15;
    this.invervalTimer;
    this.winner = undefined;
    this.jackpot = 0;
    this.status = 'init';
    this.phrase = 'test';
    //this.phrase = '"Design is not just what it looks like and feels like. Design is how it works. What a computer is to me is the most remarkable tool that we have ever come up with. Its the equivalent of a bicycle for our minds"';

}

Game.prototype.startGame = function(){
    var self = this;

    // send to all that game start
    // broadcast time
    _.each(self.users,function(user){
        console.log(self.timer);
        if(user.socket) {
            console.log('sending to members that game starting , and they need to switch page');
            // broadcast the sentence
            user.socket.emit('pickedMember_response', {uuid:self.uuid,phrase:self.phrase});
        }
    });




    //_.each(self.users,function(user){
    //    console.log(self.timer);
    //    if(user.socket) {
    //        user.socket.emit('gameInitData_push',  );
    //    }
    //});

    self.status = 'working';
    self.invervalTimer = setInterval(function(){

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

            clearInterval(self.invervalTimer);
        }

    },1000);
};

Game.prototype.calculate = function(data,socket){

    var self = this;

    // do only when game is working status
    if (self.status !== 'working') return false;

    // update private data
    var currentUser = self.users[socket.id];
    currentUser.txt = data.inputVal;

    // check if somebody win & end the game
    _.each(self.users,function(user){

        if(!self.winner && user.txt === self.phrase) {
            // we have a winner!
            self.status = 'end';
            clearInterval(self.invervalTimer);
            self.winner = user;

            // broadcast that game over - and calculate game result
            _.each(self.users,function(user){
                if(user.socket == self.winner.socket) {
                    user.socket.emit('gameEnd_push', 'win');
                }else{
                    user.socket.emit('gameEnd_push', 'lost');
                }
            });


        }
    });


    // if not , send a feedback to users (opponent mistakes, rewords, etc... )

};


module.exports = Game;
