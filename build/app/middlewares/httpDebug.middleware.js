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
exports.httpDebugMiddleware = function () {
    return function (request, response, next) {
        winston.http("Endpoint has been called: " + request.method + " " + request.url);
        winston.debug(request.method + " " + request.url + " --> query: " + JSON.stringify(request.query) + " | body: " + JSON.stringify(request.body));
        next();
    };
};
//# sourceMappingURL=httpDebug.middleware.js.map