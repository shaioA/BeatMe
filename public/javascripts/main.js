/**
 * Created by Shai on 1/16/2016.
 */

var gameUuid = {};

$(document).ready(function(){
    //show login page when loading application
    $('#loginPage').show();

    //connect to the server
    var socket = io.connect();

    // socket listener
    socket.on('login123_response',function(data){
        console.log(data);

        if(data){
            // get in to the app
            $('#loginPage').hide();
            $('#iconsPage').show();
            $('header').css('display', 'block');
        }
    });

    //listener game type responds
    socket.on('gametype_response', function(game) {
    // getting obj : title, text(arr), icon name

        // insert data to dom

        // get in to the app
        //$('#loginPage').hide();
        //$('#gamesPage').show();



    });

    socket.on('gameJoin_response',function(data){

        gameUuid = data.uuid;
        console.log('game uuid = ' , data.uuid);

        // populate next screen
        $.each(data.users,function(i, user){

            $('#user-connected').append('<li><a href=""><span class="tab">' + user.name+ '</span></a></li>');
        });




        $('#iconsPage').hide();
        $('#userList').show();

    });

    socket.on('timer_response',function(time){
        console.log(time);
        $('#timer').html(time);
    });

    //click on login button display games page
   $('.loginButton').click(function() {
       socket.emit('login123',{user:'shai',pwd:'robinzon'});
       });

   //go to the game page
   $('.box > ul > li img').click(function(e) {
       var game = $(this).attr('data-game');

       //console.log('sending to server...');
       //socket.emit('gametype', {typeGame: game });


       //start game
       socket.emit('gameJoin', {});

   });

    //game start page
    $('input').on('input',function(e){
        console.log('writing: ', $(this).val());
        socket.emit('userwriting', {uuid: gameUuid, inputVal:$(this).val()});
    });

    //listener game type responds
//    socket.on('opponent_response', function(game) {
//
//        $('#opponentTxt').html(game.opponentTxt);
//
//    });


    //listener game TXT responds
    socket.on('opponentTxt', function(game) {

        $('#opponentTxt').html(game.opponentTxt);

    });



});