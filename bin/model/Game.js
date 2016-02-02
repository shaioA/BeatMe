
function Game(type, users){
    this.type = type;
    this.users = users;
    this.timer = 0;

}

Game.prototype.startGame = function(socket){
    var self = this;

    setInterval(function(){

        console.log(self.timer);
        socket.emit('timer_response', self.timer);
    },1000);
}


