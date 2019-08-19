"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = __importStar(require("winston"));
var myFormat = winston_1.format.printf(function (info) {
    return "[" + info.level + "]: " + info.message;
});
var createWinston = function () {
    winston_1.default.configure({
        transports: [
            new winston_1.default.transports.Console({
                level: "debug",
            })
        ],
        format: winston_1.default.format.combine(winston_1.format.colorize(), winston_1.format.timestamp(), myFormat)
    });
};
exports.createWinston = createWinston;
//# sourceMappingURL=createWinston.js.map