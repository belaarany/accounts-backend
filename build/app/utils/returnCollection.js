"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var etag_1 = __importDefault(require("etag"));
var returnCollection = function (kind, collection, additional) {
    var ret = {};
    ret.kind = kind;
    ret.etag = etag_1.default(JSON.stringify(collection));
    if (additional !== undefined) {
        ret = Object.assign(ret, additional);
    }
    ret.collection = collection;
    return ret;
};
exports.returnCollection = returnCollection;
//# sourceMappingURL=returnCollection.js.map