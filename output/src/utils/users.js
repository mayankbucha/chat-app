"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveRooms = exports.removeFromActiveRoom = exports.addToActiveRoom = exports.getUsersInRoom = exports.getUser = exports.removeUser = exports.addUser = void 0;
var users = [];
var activeRooms = [];
var addUser = function (_a) {
    var id = _a.id, username = _a.username, room = _a.room;
    // Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    // validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        };
    }
    // Check for existing user
    var existingUser = users.find(function (user) {
        return user.room === room && user.username === username;
    });
    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        };
    }
    // Store user
    var user = { id: id, username: username, room: room };
    users.push(user);
    return { user: user };
};
exports.addUser = addUser;
var removeUser = function (id) {
    var index = users.findIndex(function (user) { return user.id === id; });
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};
exports.removeUser = removeUser;
var getUser = function (id) {
    return users.find(function (user) { return user.id === id; });
};
exports.getUser = getUser;
var getUsersInRoom = function (room) {
    return users.filter(function (user) { return user.room === room; });
};
exports.getUsersInRoom = getUsersInRoom;
var addToActiveRoom = function (room) {
    room = room.trim().toLowerCase();
    var idx = activeRooms.findIndex(function (activerRoom) { return activerRoom === room; });
    if (idx === -1) {
        activeRooms.push(room);
    }
    return activeRooms;
};
exports.addToActiveRoom = addToActiveRoom;
var removeFromActiveRoom = function (room) {
    var idx = activeRooms.findIndex(function (activerRoom) { return activerRoom === room; });
    if (idx !== -1) {
        activeRooms.splice(idx, 1);
        return activeRooms;
    }
    return activeRooms;
};
exports.removeFromActiveRoom = removeFromActiveRoom;
var getActiveRooms = function () {
    return activeRooms;
};
exports.getActiveRooms = getActiveRooms;
//# sourceMappingURL=users.js.map