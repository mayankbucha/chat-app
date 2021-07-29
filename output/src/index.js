"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require('path');
var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var Filter = require('bad-words');
var messages_1 = require("./utils/messages");
var users_1 = require("./utils/users");
var app = express();
var server = http.createServer(app);
var io = socketio(server);
var port = process.env.PORT || 3000;
var publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));
io.on('connection', function (socket) {
    console.log('New Websocket connection');
    socket.emit('activeRooms', users_1.getActiveRooms());
    socket.on('join', function (_a, callback) {
        var username = _a.username, room = _a.room;
        var _b = users_1.addUser({ id: socket.id, username: username, room: room }), error = _b.error, user = _b.user;
        if (error) {
            return callback(error);
        }
        socket.join(user.room);
        io.emit('activeRooms', users_1.addToActiveRoom(user.room));
        socket.emit('message', messages_1.generateMessage('Admin', 'Welcome!'));
        socket.broadcast.to(user.room).emit('message', messages_1.generateMessage('Admin', user.username + " has joined!"));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: users_1.getUsersInRoom(user.room)
        });
        callback();
    });
    socket.on('sendMessage', function (message, callback) {
        var user = users_1.getUser(socket.id);
        var filter = new Filter();
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!');
        }
        io.to(user.room).emit('message', messages_1.generateMessage(user.username, message));
        callback();
    });
    socket.on('disconnect', function () {
        var user = users_1.removeUser(socket.id);
        if (user) {
            var users = users_1.getUsersInRoom(user.room);
            if (users.length == 0) {
                io.emit('activeRooms', users_1.removeFromActiveRoom(user.room));
            }
            io.to(user.room).emit('message', messages_1.generateMessage('Admin', user.username + " has left!"));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: users_1.getUsersInRoom(user.room)
            });
        }
    });
    socket.on('sendLocation', function (location, callback) {
        var user = users_1.getUser(socket.id);
        io.to(user.room).emit('locationMessage', messages_1.generateLocationMessage(user.username, "https://www.google.com/maps?q=" + location.lat + "," + location.long));
        callback();
    });
});
server.listen(port, function () {
    console.log("Server is up on port " + port + "!");
});
//# sourceMappingURL=index.js.map