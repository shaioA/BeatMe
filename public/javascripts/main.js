/**
 * Created by Shai on 1/16/2016.
 */



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

    //click on login button display games page
   $('.loginButton').click(function() {
       socket.emit('login123',{user:'shai',pwd:'robinzon'});
       });

   //go to the game page
   $('.box > ul > li img').click(function(e) {
       var game = $(this).attr('data-game');

       //console.log('sending to server...');
       //socket.emit('gametype', {typeGame: game });

       $('#iconsPage').hide();
       $('#gameStart').show();
   });

    //game start page
    $('input').on('input',function(e){
        console.log('writing: ', $(this).val());
        socket.emit('userwriting', {gameNumber: 123, inputVal:$(this).val()});
    });

    //listener game type responds
    socket.on('opponent_response', function(game) {

        $('#opponentTxt').html(game.opponentTxt);

    });

});