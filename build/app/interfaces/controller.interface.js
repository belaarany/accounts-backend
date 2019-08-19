"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = __importStar(require("express"));
//import * as winston from "winston"
var errorResponse_1 = require("@helpers/errorResponse");
var WebController = /** @class */ (function () {
    function WebController() {
        this.router = express.Router();
        this.errorResponse = new errorResponse_1.ErrorResponse();
    }
    return WebController;
}());
exports.WebController = WebController;
//# sourceMappingURL=controller.interface.js.map