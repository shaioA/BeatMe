/**
 * Created by Benr on 2/2/2016.
 */
var Game = require('./../model/Game.js');


function MainCtrl(){

}

MainCtrl.prototype.init = function(io){

    io.on('connection', function (socket) {
        console.log('connection');

        // LOGIN
        socket.on('login123', function (data) {
            console.log(data);
            socket.emit('login123_response', "you can get it!");
        });


        // GAME
        socket.on('gameStart', function (data) {
            console.log(data);

            var game = new Game();
            game.startGame();



            //socket.emit('login123_response', "you can get it!");
        });

        // GAME
        socket.on('userwriting', function (data) {
            console.log(data);
            //socket.emit('login123_response', "you can get it!");
        });

    });



};


module.exports = new MainCtrl();