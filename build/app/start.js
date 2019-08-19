"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var clear_1 = __importDefault(require("clear"));
var server_1 = require("~app/server");
var app_1 = require("~app/app");
clear_1.default();
var app = new app_1.App();
var server = null;
app.bootstrap()
    .then(function () {
    server = new server_1.Server(app);
    server.listen("@env");
});
//# sourceMappingURL=start.js.map