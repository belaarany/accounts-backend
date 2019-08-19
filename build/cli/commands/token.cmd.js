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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var tokenHandler = __importStar(require("~app/utils/tokenHandler"));
var command_interface_1 = require("../interfaces/command.interface");
module.exports = /** @class */ (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.decodeToken = function (args, done) {
            var decoded = tokenHandler.decode(args.token);
            console.log({ decoded: decoded });
            done();
        };
        return _this;
    }
    class_1.prototype.load = function (props) {
        this.app = props.app;
        props.cli
            .command("token:decode <token>")
            .description("Decodes a token")
            .action(this.decodeToken);
    };
    return class_1;
}(command_interface_1.ACommand));
//# sourceMappingURL=token.cmd.js.map