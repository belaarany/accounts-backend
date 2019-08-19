"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cryptr_1 = __importDefault(require("cryptr"));
var encode = function (oid, payload) {
    if (payload === undefined)
        payload = {};
    try {
        var cryptr = new cryptr_1.default(process.env.APP_TOKEN_SECRET);
        return cryptr.encrypt(JSON.stringify({ oid: oid, payload: payload }));
    }
    catch (e) {
        return "";
    }
};
exports.encode = encode;
var decode = function (token) {
    var cryptr = new cryptr_1.default(process.env.APP_TOKEN_SECRET);
    if (token === undefined || token === null || token.length === 0) {
        return { oid: "", payload: {} };
    }
    try {
        return JSON.parse(cryptr.decrypt(token));
    }
    catch (e) {
        return { oid: "", payload: {} };
    }
};
exports.decode = decode;
//# sourceMappingURL=tokenHandler.js.map