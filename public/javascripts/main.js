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

    // martush -> please encapsulate those init app actions in a function (always in programing you want to encapsulate as you can)

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


    // martush -> please encapsulate those socket actions in a obj/class

    //connect to the server
    var socket = io.connect();

    // socket listeners (Server push msgs)
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
    socket.on('gametype_response', function(game) {
    // getting obj : title, text(arr), icon name

        // insert data to dom

        // get in to the app
        //$('#loginPage').hide();
        //$('#gamesPage').show();



    });
    //listener game type responds - User picked hit a Game Icon
    socket.on('gameJoin_response',function(data){

        gameUuid = data.uuid;
        console.log('game uuid = ' , data.uuid);

        // populate next screen
        $.each(data.users,function(i, user){
            var opponentPic = '../images/ryan.jpg';
            $('#user-connected').append('<div userSocketId="'+user.id+'"><img class="player-pic" src="'+ opponentPic +'"/><p>' + user.name+ '</p></div>');
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

        gameUuid = obj.uuid;

        //init page
        $('input').val('');
        $('#phrase-text').html(obj.phrase);
        //$('#me-player').html('');

        //go to game page
        $('#iconsPage').css('display', 'none');
        $('#rulesGame').css('display', 'none');
        $('#userList').css('display', 'none');

        //initialize picture of player
        var myPic = '../images/brie.jpg';
        $('#me-player').empty().append('<img class="player-pic" src="'+ myPic +'"  />');




        //$('#me-player').css('background', 'url('+ myPic + ') center center no-repeat');
        var opponentPic = '../images/ryan.jpg';

        $('#opponent-player').empty().append('<img class="player-pic" src="'+ opponentPic +'"/>');
        //$('#opponent-player').css('background', 'url('+ opponentPic + ') center center no-repeat');

        // show page
        $('#gameStart').css('display', 'flex');







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

        //animate img
        $('#opponent-player .player-pic').addClass('animated pulse');
        $('#opponent-player').addClass('shadow-border-red');

        setTimeout(function(){
            $('#opponent-player').removeClass('shadow-border-red');
            $('#opponent-player .player-pic').removeClass('animated pulse');
        }, 2000);

        var audio = $("#beepAlert")[0];
        audio.play();
    });



    // button - click on login button display games page
   $('.startPage img').click(function() {
       socket.emit('login123',{user:'shai',pwd:'robinzon'});
       });

    // button - after game is over, clicking will navigate you to games list page
    $('#BackToGames').click(function() {
//        $('#iconsPage').show();

        $('#iconsPage').css('display', 'flex');
        $('#gameEnd').hide();
    });

   //go to the game page
   $('.iconGame-item').click(function(e) {

       var game = $(this).attr('data-game');
        //if (!game) return false;

       //console.log('sending to server...');
       //socket.emit('gametype', {typeGame: game });

       //animate img
       $(this).addClass('animated flipInY');

       setTimeout(function(){
           //$(this).removeClass('animated flipInY');
           $('.iconGame-item.animated.flipInY').removeClass('animated flipInY');
           //start game
           socket.emit('gameJoin', {});
       },1100);

   });

    //game start page
    $('input').on('input',function(e){
        console.log('writing: ', $(this).val());
        socket.emit('gameStream', {uuid: gameUuid, inputVal:$(this).val()});
    });

    //interactive light
    //(function blink() {
    //    $('.blink').fadeOut(500).fadeIn(500, blink);
    //})();
});