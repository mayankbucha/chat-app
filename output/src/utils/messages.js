"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLocationMessage = exports.generateMessage = void 0;
var generateMessage = function (username, text) {
    return {
        username: username,
        text: text,
        createdAt: new Date().getTime()
    };
};
exports.generateMessage = generateMessage;
var generateLocationMessage = function (username, url) {
    return {
        username: username,
        url: url,
        createdAt: new Date().getTime()
    };
};
exports.generateLocationMessage = generateLocationMessage;
//# sourceMappingURL=messages.js.map