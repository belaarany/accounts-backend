"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bcryptjs_1 = require("bcryptjs");
exports.encryptPassword = function (plain) {
    var salt = bcryptjs_1.genSaltSync(10);
    var hash = bcryptjs_1.hashSync(plain, salt);
    return hash;
};
exports.validatePassword = function (plain, encrypted) {
    return Boolean(bcryptjs_1.compareSync(plain, encrypted) === true);
};
//# sourceMappingURL=encryptPassword.js.map