/**
 * Created by Shai on 1/16/2016.
 */

var gameUuid = {};

$(document).ready(function(){

    //show login page when loading application
    $('#loginPage').show();
    $('header').css('visibility', 'hidden');
    $('footer').css('visibility', 'hidden');

    //connect to the server
    var socket = io.connect();



    // socket listener
    socket.on('login123_response',function(data){
        console.log(data);

        if(data){
            // get in to the app
            $('#loginPage').hide();
            $('#iconsPage').show();
            $('header').css('visibility', 'visible');
            $('footer').css('visibility', 'visible');
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

            $('#user-connected').append('<li userSocketId="'+user.id+'"><span class="tab">' + user.name+ '</span></li>');
        });

        $('#user-connected li').click(function(){

            var userSocketId = $(this).attr('userSocketId');
            console.log(userSocketId);
            socket.emit('pickedMember',{uuid:gameUuid, userSocketId:userSocketId});
        });


        $('#iconsPage').hide();
        $('#userList').show();

    });

    socket.on('timer_push',function(time){
        console.log(time);
        $('#timer').html(time);
    });

    socket.on('pickedMember_response',function(uuid){


        console.log('pickedMember_response!');
        gameUuid = uuid;

        //go to game page
        $('#iconsPage').css('display', 'none');
        $('#rulesGame').css('display', 'none');
        $('#userList').css('display', 'none');

        $('#gameStart').css('display', 'flex');

        //$('#iconsPage').hide();
        //$('#rulesGame').hide();
        //$('#userList').hide();

        //$('#gameStart').show();

    });

    socket.on('gameInitData_push',function(gameInitData){
        $('#sentence').html(gameInitData);
    });

    socket.on('gameEnd_push',function(result){
        console.log(result);
        if(result && result === 'win'){
            $('#youWhat').html('You Won!');
        }else {
            $('#youWhat').html('You Lost!');
        }

        $('#gameStart').hide();
        $('#gameEnd').show();

    });



    //click on login button display games page
   $('.startPage img').click(function() {
       socket.emit('login123',{user:'shai',pwd:'robinzon'});
       });

    $('#BackToGames').click(function() {
        $('#iconsPage').show();
        $('#gameEnd').hide();
    });

    //for develop purposes ONLY (Martha)
    $('.jumpPage').click(function(){
        $('#userList').css('display', 'none');
        $('#gameStart').css('display', 'flex');
    });

   //go to the game page
   $('.flex-item').click(function(e) {
       var game = $(this).attr('data-game');


       //console.log('sending to server...');
       //socket.emit('gametype', {typeGame: game });

       //animate img
       $(this).addClass('animated flipInY');

       setTimeout(function(){
           //$(this).removeClass('animated flipInY');
           $('.flex-item.animated.flipInY').removeClass('animated flipInY');
           //start game
           socket.emit('gameJoin', {});
       },1100);





   });



    //game start page
    $('input').on('input',function(e){
        console.log('writing: ', $(this).val());
        socket.emit('gameStream', {uuid: gameUuid, inputVal:$(this).val()});
    });

    //listener game type responds
//    socket.on('opponent_response', function(game) {
//
//        $('#opponentTxt').html(game.opponentTxt);
//
//    });


    //listener game TXT responds
    socket.on('opponentTxt_push', function(game) {
        console.log(game);
        $('#opponentTxt').html(game.inputVal);

    });



});