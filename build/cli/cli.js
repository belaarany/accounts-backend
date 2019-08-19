"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vorpal_1 = __importDefault(require("vorpal"));
var clear_1 = __importDefault(require("clear"));
var loader_1 = require("./loader");
var app_1 = require("../app/app");
var cli = new vorpal_1.default();
var app = new app_1.App();
clear_1.default();
app.bootstrap()
    .then(function () {
    loader_1.CommandLoader.load({
        cli: cli,
        app: app,
    });
    clear_1.default();
    printMOTD();
    cli
        .delimiter("goabela-accounts-cli$")
        .show();
});
function printMOTD() {
    console.log("===========================================");
    console.log("Welcome to the GOabela Accounts CLI");
    console.log();
    console.log("To list the available commands, type 'help'");
    console.log("===========================================");
    console.log();
}
function onExit() {
    //server.shutdown()
}
process.on("SIGINT", onExit);
process.on("exit", onExit);
//# sourceMappingURL=cli.js.map