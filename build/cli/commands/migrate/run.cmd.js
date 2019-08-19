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
var command_interface_1 = require("../../interfaces/command.interface");
var clear = require("clear");
module.exports = /** @class */ (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.action = function (args, done) {
            _this.app.getDatabaseConnection().runMigrations()
                .then(function (res) {
                console.log({ res: res });
                done();
            });
        };
        return _this;
    }
    class_1.prototype.load = function (props) {
        this.app = props.app;
        props.cli
            .command("migrate:run")
            .alias("m:r")
            .description("Runs all migrations")
            .action(this.action);
    };
    return class_1;
}(command_interface_1.ACommand));
//# sourceMappingURL=run.cmd.js.map