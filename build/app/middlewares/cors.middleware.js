"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = function () {
    return function (request, response, next) {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
        response.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
        next();
    };
};
//# sourceMappingURL=cors.middleware.js.map