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
var mung = __importStar(require("express-mung"));
var camelcase_keys_1 = __importDefault(require("camelcase-keys"));
var snakecase_keys_1 = __importDefault(require("snakecase-keys"));
exports.preProcessRequestMiddleware = function () {
    return function (request, response, next) {
        request.query = camelcase_keys_1.default(request.query, { deep: true });
        request.body = camelcase_keys_1.default(request.body, { deep: true });
        next();
    };
};
exports.postProcessResponseMiddleware = function () {
    return mung.json(function (body, request, response) {
        return snakecase_keys_1.default(body);
    });
};
//# sourceMappingURL=processTraffic.middleware.js.map