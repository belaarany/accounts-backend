"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var command_interface_1 = require("../interfaces/command.interface");
// @ts-ignore
var expressListEndpoints = require("express-list-endpoints");
var consoleTable = require("cli-table");
module.exports = /** @class */ (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.load = function (props) {
            _this.app = props.app;
            props.cli
                .command("routes:list")
                .alias("r:l")
                .description("Lists all routes")
                .action(_this.action);
        };
        _this.action = function (args, done) {
            var app = _this.app;
            var express = app.getExpress();
            var routes = expressListEndpoints(express._router);
            var table = new consoleTable({
                head: ["Methods", "Path"]
            });
            routes.forEach(function (route) {
                table.push([
                    route.methods,
                    route.path,
                ]);
            });
            console.log(table.toString());
            //console.log({routes})
            done();
        };
        return _this;
    }
    return class_1;
}(command_interface_1.ACommand));
//# sourceMappingURL=routes-list.cmd.js.map