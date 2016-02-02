
function Game(type, users){
    this.type = type;
    this.users = users;
    this.timer = 15;

}

Game.prototype.startGame = function(socket){
    var self = this;

    var timer = setInterval(function(){

        console.log(self.timer);
        socket.emit('timer_response', self.timer);
        self.timer--;

        if(self.timer > 15){
            console.log('Time ended !');
            clearInterval(timer);
        }

    },1000);
}

module.exports = Game;
