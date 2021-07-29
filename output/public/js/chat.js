"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var socket_io_1 = __importDefault(require("socket.io"));
var Qs = __importStar(require("query-string"));
var Mustache = __importStar(require("mustache"));
var moment_1 = __importDefault(require("moment"));
var socket = socket_io_1.default.io();
// Elements
var $messageForm = document.querySelector('#message-form');
var $mesageFormInput = $messageForm.querySelector('input');
var $messageFormButton = $messageForm.querySelector('button');
var $sendLocationbutton = document.querySelector('#send-location');
var $messages = document.querySelector('#messages');
// Templates
var messageTemplate = document.querySelector('#message-template').innerHTML;
var locationTemplate = document.querySelector('#location-template').innerHTML;
var sidebarTeplate = document.querySelector('#sidebar-template').innerHTML;
// Array to store message in session storage.
var messages = [];
// Options
var _a = Qs.parse(location.search), username = _a.username, room = _a.room;
var autoscroll = function () {
    // New message element
    var $newMessage = $messages.lastElementChild;
    // Height of the last message
    var newMessageStyles = getComputedStyle($newMessage);
    var newMessageMargin = parseInt(newMessageStyles.marginBottom);
    var newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
    // Visible height
    var VisibleHeight = $messages.offsetHeight;
    // Height of messages container
    var containerHeight = $messages.scrollHeight;
    // How far have i scrolled
    var scrollOffset = $messages.scrollTop + VisibleHeight;
    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
};
socket.on('message', function (message) {
    console.log(message);
    var localMessages = sessionStorage.getItem("Message");
    if (message.text === "Welcome!" && localMessages) {
        messages = JSON.parse(localMessages);
        renderLocalMessages(JSON.parse(localMessages));
        return;
    }
    else {
        messages.push(message);
        sessionStorage.setItem("Message", JSON.stringify(messages));
    }
    Mustache.parse(messageTemplate);
    var html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment_1.default(message.createdAt).format('h:mm a'),
        timestamp: message.createdAt
    });
    $messages.insertAdjacentHTML('beforeend', html);
});
var renderLocalMessages = function (messagesArray) {
    messagesArray.forEach(function (message) {
        if (message.url) {
            Mustache.parse(locationTemplate);
            var html = Mustache.render(locationTemplate, {
                username: message.username,
                url: message.url,
                createdAt: moment_1.default(message.createdAt).format('h:mm a'),
                timestamp: message.createdAt
            });
            $messages.insertAdjacentHTML('beforeend', html);
        }
        else {
            Mustache.parse(messageTemplate);
            var html = Mustache.render(messageTemplate, {
                username: message.username,
                message: message.text,
                createdAt: moment_1.default(message.createdAt).format('h:mm a'),
                timestamp: message.createdAt
            });
            $messages.insertAdjacentHTML('beforeend', html);
        }
    });
    // Srolling to the end of page
    $messages.scrollTop = $messages.scrollHeight;
};
socket.on('locationMessage', function (message) {
    console.log(message);
    messages.push(message);
    sessionStorage.setItem("Message", JSON.stringify(messages));
    Mustache.parse(locationTemplate);
    var html = Mustache.render(locationTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment_1.default(message.createdAt).format('h:mm a'),
        timestamp: message.createdAt
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});
socket.on('roomData', function (_a) {
    var room = _a.room, users = _a.users;
    var html = Mustache.render(sidebarTeplate, {
        room: room,
        users: users
    });
    document.querySelector('#sidebar').innerHTML = html;
});
$messageForm.addEventListener('submit', function (e) {
    e.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled');
    var message = e.target.value;
    socket.emit('sendMessage', message, function (error) {
        $messageFormButton.removeAttribute('disabled');
        $mesageFormInput.value = '';
        $mesageFormInput.focus();
        if (error) {
            return console.log(error);
        }
        console.log('Message delivered!');
    });
});
// Delete message
$messages.addEventListener('click', function (e) {
    if (e.target && e.target.className == "message__options") {
        var timestamp_1 = e.target.getAttribute('data-timestamp');
        messages = messages.filter(function (message) { return message.createdAt != parseInt(timestamp_1); });
        sessionStorage.setItem("Message", JSON.stringify(messages));
        $messages.innerHTML = '';
        renderLocalMessages(messages);
    }
});
$sendLocationbutton.addEventListener('click', function (e) {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.');
    }
    $sendLocationbutton.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('sendLocation', {
            lat: position.coords.latitude,
            long: position.coords.longitude
        }, function () {
            $sendLocationbutton.removeAttribute('disabled');
            console.log('Location Shared!');
        });
    });
});
socket.emit('join', { username: username, room: room }, function (error) {
    if (error) {
        alert(error);
        location.href = '/';
    }
});
//# sourceMappingURL=chat.js.map