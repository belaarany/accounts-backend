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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = __importStar(require("express"));
var winston = __importStar(require("winston"));
var typeorm_1 = require("typeorm");
var controller_interface_1 = require("../interfaces/controller.interface");
var requestValidator_middleware_1 = require("@middlewares/requestValidator.middleware");
var account_entity_1 = require("@models/account/account.entity");
var account_dto_1 = require("@models/account/account.dto");
var returnCollection_1 = require("@utils/returnCollection");
var encryptPassword_1 = require("@utils/encryptPassword");
var default_1 = /** @class */ (function (_super) {
    __extends(default_1, _super);
    function default_1(accountRepository) {
        if (accountRepository === void 0) { accountRepository = typeorm_1.getRepository(account_entity_1.Account); }
        var _this = _super.call(this) || this;
        _this.accountRepository = accountRepository;
        _this.path = "/accounts";
        _this.router = express.Router();
        _this.registerRoutes = function () {
            _this.router
                .get("", _this.list)
                .get("/:id", requestValidator_middleware_1.requestValidatorMiddleware({ params: account_dto_1.GetParamsSchema }), _this.get)
                .post("", requestValidator_middleware_1.requestValidatorMiddleware({ body: account_dto_1.CreateBodySchema }), _this.create);
        };
        _this.create = function (request, response, next) {
            var body = request.body;
            var account = _this.accountRepository.create({
                identifier: body.identifier,
                password: encryptPassword_1.encryptPassword(body.password),
                passwordEncryption: "bcrypt",
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
            });
            _this.accountRepository.save(account)
                .then(function (result) {
                // ---
                // Do not return the result directly because it contains the password!
                // ---
                _this.accountRepository.findOneOrFail({ id: result.id })
                    .then(function (account) {
                    winston.debug("Account created --> " + JSON.stringify(account));
                    response.json(account);
                });
            });
        };
        _this.list = function (request, response, next) {
            _this.accountRepository.find()
                .then(function (accounts) {
                response.json(returnCollection_1.returnCollection("accounts.accountList", accounts));
            });
        };
        _this.get = function (request, response, next) {
            var params = request.params;
            _this.accountRepository.findOneOrFail({ id: params.id })
                .then(function (account) {
                response.json(account);
            });
        };
        return _this;
    }
    return default_1;
}(controller_interface_1.WebController));
exports.default = default_1;
//# sourceMappingURL=accounts.controller.js.map