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
var uuid_1 = __importDefault(require("uuid"));
var ErrorReason;
(function (ErrorReason) {
    var Account;
    (function (Account) {
        Account["INVALID_PASSWORD"] = "account.invalidPassword";
        Account["ACCOUNT_NOT_EXISTS"] = "account.accountNotExists";
        Account["INVALID_LOOKUP_METHOD"] = "account.invalidLookupMethod";
    })(Account = ErrorReason.Account || (ErrorReason.Account = {}));
    var Authorization;
    (function (Authorization) {
        Authorization["ACCESS_DENIED"] = "authorization.accessDenied";
    })(Authorization = ErrorReason.Authorization || (ErrorReason.Authorization = {}));
    var Request;
    (function (Request) {
        Request["INVALID_BODY_PROPERTY"] = "request.body.invalidProperty";
        Request["INVALID_PARAMETER_PROPERTY"] = "request.params.invalidProperty";
    })(Request = ErrorReason.Request || (ErrorReason.Request = {}));
    var Server;
    (function (Server) {
        Server["SERVER_ERROR"] = "server.serverError";
    })(Server = ErrorReason.Server || (ErrorReason.Server = {}));
})(ErrorReason = exports.ErrorReason || (exports.ErrorReason = {}));
var ErrorResponse = /** @class */ (function () {
    function ErrorResponse(expressResponse) {
        var _this = this;
        this.reset = function () {
            _this.errors = [];
            _this.code = 400;
            _this.uuid = uuid_1.default();
        };
        this.addError = function (error) {
            _this.errors.push(error);
            winston.debug("ErrorResponse (" + _this.uuid + "): addError --> error: " + JSON.stringify(error));
            return _this;
        };
        this.setStatusCode = function (code) {
            _this.code = code;
            winston.debug("ErrorResponse (" + _this.uuid + "): setStatusCode --> error: " + code);
            return _this;
        };
        this.serialize = function () {
            return {
                error: {
                    errors: _this.errors,
                    code: _this.code,
                    message: (_this.errors[0] && _this.errors[0].message) || "Unknown error",
                    uid: _this.uuid,
                },
            };
        };
        this.send = function (expressResponse) {
            if (expressResponse !== undefined)
                _this.expressResponse = expressResponse;
            if (_this.expressResponse !== undefined) {
                winston.debug("ErrorResponse (" + _this.uuid + "): send");
                _this.expressResponse.status(_this.code).json(_this.serialize());
                _this.reset();
            }
            else {
                winston.error("Trying to send an ErrorResponse, however no response object has set");
            }
        };
        if (expressResponse !== undefined)
            this.expressResponse = expressResponse;
        this.reset();
    }
    return ErrorResponse;
}());
exports.ErrorResponse = ErrorResponse;
//# sourceMappingURL=errorResponse.js.map