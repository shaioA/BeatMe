/**
 * Created by Shai on 1/16/2016.
 */

var gameUuid = {};


//if ('ontouchstart' in window) {
//    window.addEventListener('load', function() {
//        FastClick.attach(document.body);
//    }, false);
//}

$(document).ready(function(){

    //show login page when loading application
    $('#loginPage').show();
    $('header').css('visibility', 'hidden');
    $('footer').css('visibility', 'hidden');

    //animate img
    $('.startPage .splashBeatMe').css('visibility', 'visible');
    $('.startPage .splashBeatMe').addClass('animated bounceIn');

    setTimeout(function(){
        $('.startPage .splashBeatMe').removeClass('animated bounceIn');
    },1100);

    //connect to the server
    var socket = io.connect();



    // socket listener
    socket.on('login123_response',function(data){
        console.log(data);

        if(data){
            // get in to the app
            $('#loginPage').hide();
//            $('#iconsPage').show();
            $('#iconsPage').css('display', 'flex');
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

            $('#user-connected').append('<div userSocketId="'+user.id+'"><img src="../images/userMale.png" /><p>' + user.name+ '</p></div>');
        });

        $('#user-connected div').click(function(){

            var userSocketId = $(this).attr('userSocketId');
            console.log(userSocketId);
            socket.emit('pickedMember',{uuid:gameUuid, userSocketId:userSocketId});
        });


        $('#iconsPage').hide();
        $('#userList').css('display', 'flex');

    });

    socket.on('timer_push',function(time){
        console.log(time);
        $('#timer').html(time);
    });

    socket.on('pickedMember_response',function(obj){


        console.log('pickedMember_response!');
        gameUuid = obj.uuid;

        //init page
        $('input').val('');
        $('#phrase-text').html(obj.phrase);

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

    socket.on('gameEnd_push',function(result){
        console.log(result);
        if(result && result === 'win'){
            $('#youWhat').html('You Won!');
            $('.gameEnd-image').attr('src', '../images/trophy.jpg');
        }else {
            $('#youWhat').html('You Lost!');
            $('.gameEnd-image').attr('src', '../images/thumbs-down.jpg');
        }

        //change page
        $('#gameStart').hide();
        $('#gameEnd').css('display', 'flex');

    });

    socket.on('opponentMistake_push', function(){
        $('#opponent-player').addClass('shadow-border-red');

        setTimeout(function(){
            $('#opponent-player').removeClass('shadow-border-red');
        }, 2000);

        var audio = $("#beepAlert")[0];
        audio.play();
    });



    //click on login button display games page
   $('.startPage img').click(function() {
       socket.emit('login123',{user:'shai',pwd:'robinzon'});
       });

    $('#BackToGames').click(function() {
//        $('#iconsPage').show();

        $('#iconsPage').css('display', 'flex');
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
        //if (!game) return false;

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


    //
    //interactive light
    //(function blink() {
    //    $('.blink').fadeOut(500).fadeIn(500, blink);
    //})();
});