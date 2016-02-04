/**
 * Created by Benr on 2/2/2016.
 */
var Game = require('./../model/Game.js');
var _ = require('lodash');

function MainCtrl(){
    this.games = [];
}

MainCtrl.prototype.init = function(io){

    var self = this;

    io.on('connection', function (socket) {
        console.log('connection');

        // LOGIN
        socket.on('login123', function (data) {
            console.log(data);
            socket.emit('login123_response', "you can get it!");
        });


        // Listner GAME
        socket.on('gameStart', function (data) {
            console.log(data);



            var game = new Game('speedType',[{socket:socket},{socket:null}]);
            game.startGame(socket);

            self.games.push(game);

            //socket.emit('login123_response', "you can get it!");
        });

        // GAME

        socket.on('userwriting', function (data) {
            console.log(data);

            //_.contains(self.games,);
            // check
            _.each(self.games,function(game){

                _.each(game.users,function(user){

                    if(user.socket === socket){

                        // action fit to this
                        _.each(game.users,function(user){

                            //send txt to all opponents
                            if(!user.socket === socket){
                                socket.emit('opponentTxt',data);
                            }
                        });
                    }
                });

            });

            //socket.emit('login123_response', "you can get it!");
        });


    });



};


module.exports = new MainCtrl();