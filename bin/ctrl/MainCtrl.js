/**
 * Created by Benr on 2/2/2016.
 */
var Game = require('./../model/Game.js');
var _ = require('lodash');
var uuid = require('node-uuid');

function MainCtrl(){
    this.games = [];
    this.usersConnected = {};
}

MainCtrl.prototype.init = function(io){

    var self = this;

    io.on('connection', function (socket) {
        console.log('connection');

        // LOGIN
        socket.on('login123', function (data) {
            console.log(data);

            var nameId = ( Math.random() * 100000 ) | 0;
            self.usersConnected[socket.id] = {
                name:'User'+nameId,
                socket:socket,
                socketId:socket.id
            };

            console.log('new user add to system +');
            console.log(' ==== Users in system :', Object.keys(self.usersConnected).length ,'====');

            socket.emit('login123_response', "you can get it!");
        });


        // PREGAME - join a room and watting room
        socket.on('gameJoin', function (data) {

            console.log('creating game...');
            var uuid1 = uuid.v1();
            console.log('game id:', uuid1);
            var game = new Game(uuid1, 'speedType',[{socket:socket},{socket:null}]);
            console.log('adding game...');
            self.games[uuid1] = game;

            var userToClient = [];
            _.each(self.usersConnected,function(key, val){
                console.log(key.name,key.socketId );
                userToClient.push({name: key.name,id:key.socketId});
            });

            console.log('sending status to all game users');
            socket.emit('gameJoin_response',{uuid:uuid,users:userToClient}); // {users: self.usersConnected,uuid: uuid1}
        });


        // Listner GAME
        socket.on('gameStart', function (data) {
            var self = this;
            console.log(data);




//            var game = new Game(uuid1, 'speedType',[{socket:socket},{socket:null}]);



            game.startGame();




        });

        // GAME - writing stream
        socket.on('userwriting', function (data) {
            console.log(data);

            //_.contains(self.games,);
            // check


            if(self.games.hasOwnProperty(data.uuid)){
                console.log('found game in cache');
                var game = self.games[data.uuid];
                // action fit to this
                _.each(game.users,function(user){

                    //send txt to all opponents
                    if(!user.socket === socket){
                        console.log('sending to other your txt');
                        socket.emit('opponentTxt',data);
                    }
                });
            }


            //socket.emit('login123_response', "you can get it!");
        });


    });



};


module.exports = new MainCtrl();