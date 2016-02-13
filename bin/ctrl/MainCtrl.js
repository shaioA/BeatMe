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
        console.log('new user connection !',socket.id);

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
            console.log('gameJoin');
            var isNeedAnewGame = true;
            // check if needed to open new game

            _.each(self.games,function(game){
                if(game.status === 'init' && !isNeedAnewGame){
                    console.log('found a game, joining... ');

                    game.users[1] = self.usersConnected[socket.id];

                    game.users[0].socket.emit('pickedMember_response',{});

                    return false;
                }
            });

            // remove dead connections
//            _.each(self.usersConnected,function(val){
//                if(val.socket.connected === false){
//                    delete val;
//                }
//            });

            for(var k in self.usersConnected) {
                if(self.usersConnected[k].socket.connected === false){
                    console.log('delete user');
                    delete self.usersConnected[k];
                }
            }


            //build members list
            var userToClient = [];
            _.each(self.usersConnected,function(key, val){
                console.log(key.name,key.socketId );
                if( socket.id != key.socketId){
                    userToClient.push({name: key.name,id:key.socketId});
                }
            });

            console.log('sending status to all game users');
            socket.emit('gameJoin_response',{uuid:null,users:userToClient}); // {users: self.usersConnected,uuid: uuid1}
        });

        socket.on('pickedMember',function(param){

            //var self = this;
            console.log('opponentSocketId:',param.userSocketId,'mySocketId:',socket.id,'uuid:',param.uuid);

            console.log('creating game...');
            var uuid1 = uuid.v1();
            console.log('game id:', uuid1);

            if(!self.usersConnected[param.userSocketId]) return false;

            var game = new Game(uuid1, 'speedType', [
                {socket: socket},
                {socket: self.usersConnected[param.userSocketId].socket}
            ]);

            console.log('user1 sok:',socket);
            console.log('user1 sok:',self.usersConnected[param.userSocketId].socket);

            console.log('adding game...');
            self.games[uuid1] = game;

            // start game
            game.startGame();
            console.log('game started!');


        });

        // GAME - start
        socket.on('gameStart', function (data) {
            var self = this;
            console.log(data);

        });

        // GAME - writing stream
        socket.on('gameStream', function (data) {
            console.log(data);

            // updating the users
            if(self.games.hasOwnProperty(data.uuid)){
                console.log('found game in cache');
                var game = self.games[data.uuid];

                //calculate game move
                game.calculate(data,socket);

                // action fit to this
                _.each(game.users,function(user){
                    console.log('user loop');
                    //send txt to all opponents
                    if(user.socket !== socket){
                        console.log('sending to other your txt');
                        user.socket.emit('opponentTxt_push',data);
                    }
                });
            }

        });

    });
};


module.exports = new MainCtrl();