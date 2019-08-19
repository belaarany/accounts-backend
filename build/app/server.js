"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston = __importStar(require("winston"));
var Server = /** @class */ (function () {
    function Server(app) {
        this.app = app;
        winston.info("Server instantiated");
    }
    Server.prototype.listen = function (port) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (port === "@env") {
                port = Number(process.env.APP_PORT || "8020");
            }
            var express = _this.app.getExpress();
            _this.server = express.listen(port, function () {
                // @ts-ignore
                var at = _this.server.address().address;
                winston.info("Server started listening at '" + at + port + "' in env '" + express.settings.env + "'");
                resolve();
            });
        });
    };
    Server.prototype.shutdown = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var server = _this.server;
            server.close(function () {
                winston.info("Server did shutdown");
                resolve();
            });
        });
    };
    return Server;
}());
exports.Server = Server;
//# sourceMappingURL=server.js.map