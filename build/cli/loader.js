"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var glob = require("glob");
var path = require("path");
var CommandLoader = /** @class */ (function () {
    function CommandLoader() {
    }
    CommandLoader.load = function (props) {
        glob.sync(__dirname + "/commands/**/*.cmd.ts").forEach(function (file) {
            var commandClass = require(file);
            new commandClass(new commandClass()).load(props);
        });
    };
    return CommandLoader;
}());
exports.CommandLoader = CommandLoader;
//# sourceMappingURL=loader.js.map