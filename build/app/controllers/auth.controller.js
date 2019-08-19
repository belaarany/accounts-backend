"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var url = __importStar(require("url"));
var tokenHandler = __importStar(require("@utils/tokenHandler"));
var moment_1 = __importDefault(require("moment"));
var typeorm_1 = require("typeorm");
var controller_interface_1 = require("~app/interfaces/controller.interface");
var requestValidator_middleware_1 = require("@middlewares/requestValidator.middleware");
var authSession_entity_1 = require("@models/authSession/authSession.entity");
var authSession_dto_1 = require("@models/authSession/authSession.dto");
var account_entity_1 = require("@models/account/account.entity");
var authSession_interface_1 = require("@models/authSession/authSession.interface");
var errorResponse_1 = require("@helpers/errorResponse");
var encryptPassword_1 = require("@utils/encryptPassword");
var default_1 = /** @class */ (function (_super) {
    __extends(default_1, _super);
    function default_1(authSessionRepository, accountRepository) {
        if (authSessionRepository === void 0) { authSessionRepository = typeorm_1.getRepository(authSession_entity_1.AuthSession); }
        if (accountRepository === void 0) { accountRepository = typeorm_1.getRepository(account_entity_1.Account); }
        var _this = _super.call(this) || this;
        _this.authSessionRepository = authSessionRepository;
        _this.accountRepository = accountRepository;
        _this.path = "/authentication";
        _this.registerRoutes = function () {
            _this.router
                .post("/init", requestValidator_middleware_1.requestValidatorMiddleware({ body: authSession_dto_1.AuthBodySchema.Init }), _this.handleInit)
                .post("/lookup", requestValidator_middleware_1.requestValidatorMiddleware({ params: authSession_dto_1.AuthParamsSchema, body: authSession_dto_1.AuthBodySchema.Lookup }), _this.handleLookup)
                .post("/challenge", requestValidator_middleware_1.requestValidatorMiddleware({ params: authSession_dto_1.AuthParamsSchema, body: authSession_dto_1.AuthBodySchema.Challenge }), _this.handleChallenge);
        };
        _this.handleInit = function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
            var body, authSession, nextSteps, responseBody, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = request.body;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, this.initializeSession({ flowType: body.flowType || null })];
                    case 2:
                        authSession = _a.sent();
                        return [4 /*yield*/, this.addCompleted(authSession.authSessionId, authSession_interface_1.StepEnum.INIT)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.getNexts(authSession.authSessionId)];
                    case 4:
                        nextSteps = _a.sent();
                        responseBody = {
                            authenticated: false,
                            authSessionToken: tokenHandler.encode(authSession.authSessionId),
                            validUntil: moment_1.default(authSession.valudUntil).format(),
                            nextSteps: nextSteps,
                        };
                        response.json(responseBody);
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        this.errorResponse.addError(e_1).send(response);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        _this.handleLookup = function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
            var body, authSessionId, _a, account, nextSteps, responseBody, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        body = request.body;
                        authSessionId = tokenHandler.decode(body.authSessionToken).oid;
                        _a = body.step;
                        switch (_a) {
                            case authSession_interface_1.StepEnum.IDENTIFIER: return [3 /*break*/, 1];
                        }
                        return [3 /*break*/, 8];
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, this.lookupAccount("regular", body.identifier)];
                    case 2:
                        account = _b.sent();
                        return [4 /*yield*/, this.assignAccountToSession(account.id, authSessionId)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.addCompleted(authSessionId, authSession_interface_1.StepEnum.IDENTIFIER)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, this.getNexts(authSessionId)];
                    case 5:
                        nextSteps = _b.sent();
                        responseBody = {
                            authenticated: false,
                            nextSteps: nextSteps,
                            account: account.getPartial(),
                        };
                        response.json(responseBody);
                        return [3 /*break*/, 7];
                    case 6:
                        e_2 = _b.sent();
                        this.errorResponse.addError(e_2).send(response);
                        return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        _this.handleChallenge = function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
            var body, authSessionId, _a, accountId, responseBody, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        body = request.body;
                        authSessionId = tokenHandler.decode(body.authSessionToken).oid;
                        _a = body.step;
                        switch (_a) {
                            case authSession_interface_1.StepEnum.PASSWORD: return [3 /*break*/, 1];
                        }
                        return [3 /*break*/, 8];
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, this.getAccountIdBySession(authSessionId)];
                    case 2:
                        accountId = _b.sent();
                        return [4 /*yield*/, this.validatePassword(accountId, body.password)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.addCompleted(authSessionId, authSession_interface_1.StepEnum.PASSWORD)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, this.markSessionAsDone(authSessionId)];
                    case 5:
                        _b.sent();
                        responseBody = {
                            authenticated: true,
                            flowType: "authorization_code",
                            code: "soon_" + Date.now(),
                        };
                        response.json(responseBody);
                        return [3 /*break*/, 7];
                    case 6:
                        e_3 = _b.sent();
                        this.errorResponse.addError(e_3).send(response);
                        return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        {
                            this.errorResponse.addError({
                                source: "request",
                                location: "params",
                                reason: errorResponse_1.ErrorReason.Request.INVALID_PARAMETER_PROPERTY,
                                property: "method",
                                message: "Unknown parameter 'method' property has been passed.",
                            })
                                .send();
                        }
                        _b.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        }); };
        _this.getNexts = function (authSessionId) {
            return new Promise(function (resolve, reject) {
                _this.authSessionRepository.findOne({ id: authSessionId })
                    .then(function (authSession) {
                    // @ts-ignore
                    var stepsCompleted = Object.keys(authSession.stepsCompleted);
                    if (stepsCompleted.length === 1) {
                        if (stepsCompleted[0] === authSession_interface_1.StepEnum.INIT) {
                            resolve([
                                {
                                    step: authSession_interface_1.StepEnum.IDENTIFIER,
                                    url: url.resolve(process.env.APP_URL, [_this.path, "lookup"].join("/")),
                                }
                            ]);
                        }
                        else {
                            reject("1");
                        }
                    }
                    else if (stepsCompleted.length > 1) {
                        if (stepsCompleted.length === 2) {
                            if (stepsCompleted[0] === authSession_interface_1.StepEnum.INIT && stepsCompleted[1] === authSession_interface_1.StepEnum.IDENTIFIER) {
                                resolve([
                                    {
                                        step: authSession_interface_1.StepEnum.PASSWORD,
                                        url: url.resolve(process.env.APP_URL, [_this.path, "challenge"].join("/")),
                                    }
                                ]);
                            }
                            else {
                                reject("2");
                            }
                        }
                        else {
                            reject("3");
                        }
                    }
                    // If no steps has been done then it's a bug
                    else {
                        reject("4");
                    }
                });
            });
        };
        _this.initializeSession = function (data) {
            return new Promise(function (resolve, reject) {
                var authSession = _this.authSessionRepository.create({
                    validUntil: moment_1.default().add(1, "hours").format(),
                    authenticatedAt: null,
                    flowType: data.flowType,
                });
                _this.authSessionRepository.save(authSession)
                    .then(function (result) {
                    resolve({
                        authSessionId: result.id,
                        valudUntil: result.validUntil,
                    });
                });
            });
        };
        _this.lookupAccount = function (by, identifier) {
            return new Promise(function (resolve, reject) {
                switch (by) {
                    case "regular": {
                        _this.accountRepository.findOneOrFail({ identifier: identifier })
                            .then(function (account) {
                            resolve(account);
                        })
                            .catch(function () {
                            reject({
                                source: "request",
                                reason: errorResponse_1.ErrorReason.Account.ACCOUNT_NOT_EXISTS,
                                message: "This Account does not exist.",
                            });
                        });
                        break;
                    }
                    default: {
                        reject({
                            source: "server",
                            reason: errorResponse_1.ErrorReason.Account.INVALID_LOOKUP_METHOD,
                            message: "Invalid Account lookup method has been requested.",
                        });
                    }
                }
            });
        };
        _this.getAccountIdBySession = function (authSessionId) {
            return new Promise(function (resolve, reject) {
                _this.authSessionRepository.findOne({ id: authSessionId })
                    .then(function (authSession) {
                    resolve(authSession.accountId);
                });
            });
        };
        _this.assignAccountToSession = function (accountId, authSessionId) {
            return new Promise(function (resolve, reject) {
                _this.authSessionRepository.update({ id: authSessionId }, { accountId: accountId })
                    .then(function () {
                    resolve();
                });
            });
        };
        _this.addCompleted = function (authSessionId, step) {
            return new Promise(function (resolve, reject) {
                _this.authSessionRepository.findOne({ id: authSessionId })
                    .then(function (authSession) {
                    var _a;
                    _this.authSessionRepository.update({ id: authSessionId }, {
                        stepsCompleted: __assign({}, authSession.stepsCompleted, (_a = {}, _a[step] = moment_1.default.utc().format(), _a)),
                    })
                        .then(function () {
                        resolve();
                    });
                });
            });
        };
        _this.validatePassword = function (accountId, plainPassword) {
            return new Promise(function (resolve, reject) {
                _this.accountRepository
                    .createQueryBuilder("account")
                    .addSelect("account.password")
                    .where({ id: accountId })
                    .getOne()
                    .then(function (account) {
                    if (account !== undefined &&
                        account !== null &&
                        Array.isArray(account) === false &&
                        typeof account === "object" &&
                        Object.keys(account).length > 0 &&
                        account.hasOwnProperty("kind") === true &&
                        account.hasOwnProperty("password") === true) {
                        if (encryptPassword_1.validatePassword(plainPassword, account.password) === true) {
                            resolve();
                        }
                        else {
                            throw Error();
                        }
                    }
                    else {
                        throw Error();
                    }
                })
                    .catch(function () {
                    reject({
                        source: "request",
                        message: "Invalid password",
                        reason: errorResponse_1.ErrorReason.Account.INVALID_PASSWORD,
                    });
                });
            });
        };
        _this.markSessionAsDone = function (authSessionId) {
            return new Promise(function (resolve, reject) {
                _this.authSessionRepository.update({ id: authSessionId }, { authenticatedAt: moment_1.default().format() })
                    .then(function () {
                    resolve();
                })
                    .catch(function (err) {
                    console.log({ err: err });
                    reject();
                });
            });
        };
        return _this;
    }
    return default_1;
}(controller_interface_1.WebController));
exports.default = default_1;
//# sourceMappingURL=auth.controller.js.map