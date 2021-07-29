"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var socket_io_1 = require("socket.io");
var socket = socket_io_1.socketio.io();
var $activeRoomList = document.querySelector('#activeRoom');
socket.emit('activeRooms');
socket.on('activeRooms', function (rooms) {
    console.log(rooms);
    var options = '';
    for (var i = 0; i < rooms.length; i++) {
        options += '<option value="' + rooms[i] + '" />';
    }
    $activeRoomList.innerHTML = options;
});
//# sourceMappingURL=home.js.map