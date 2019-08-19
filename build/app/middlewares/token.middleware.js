"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston = __importStar(require("winston"));
var express_bearer_token_1 = __importDefault(require("express-bearer-token"));
var errorResponse_1 = require("@helpers/errorResponse");
exports.tokenMiddleware = function () { return [
    express_bearer_token_1.default(),
    function (request, response, next) {
        var token = request.token;
        if (request.method == "OPTIONS") {
            winston.debug("Bearer Token: 'OPTIONS' request has been received so ignoring token validation");
            next();
        }
        else {
            if (token !== process.env.APP_DEV_BEARER_TOKEN) {
                winston.error("Invalid OAuth Authorization (Dev Bearer Token) --> token: " + token);
                var errorResponse = new errorResponse_1.ErrorResponse(response);
                errorResponse
                    .addError({
                    source: "authorization",
                    reason: errorResponse_1.ErrorReason.Authorization.ACCESS_DENIED,
                    message: "Invalid authorization.",
                })
                    .setStatusCode(403)
                    .send();
            }
            else {
                next();
            }
        }
    },
]; };
//# sourceMappingURL=token.middleware.js.map