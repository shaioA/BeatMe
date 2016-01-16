/**
 * Created by Shai on 1/16/2016.
 */

var socket = io.connect();
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});