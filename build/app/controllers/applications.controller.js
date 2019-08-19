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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = __importStar(require("express"));
var winston = __importStar(require("winston"));
var typeorm_1 = require("typeorm");
var controller_interface_1 = require("../interfaces/controller.interface");
var requestValidator_middleware_1 = require("@middlewares/requestValidator.middleware");
var crypto_random_string_1 = __importDefault(require("crypto-random-string"));
var application_entity_1 = require("@models/application/application.entity");
var application_dto_1 = require("@models/application/application.dto");
var default_1 = /** @class */ (function (_super) {
    __extends(default_1, _super);
    function default_1(applicationRepository) {
        if (applicationRepository === void 0) { applicationRepository = typeorm_1.getRepository(application_entity_1.Application); }
        var _this = _super.call(this) || this;
        _this.applicationRepository = applicationRepository;
        _this.path = "/applications";
        _this.router = express.Router();
        _this.registerRoutes = function () {
            _this.router
                .get("/exchangeClientId/:clientId", requestValidator_middleware_1.requestValidatorMiddleware({ params: application_dto_1.Request.ExchangeClientId.Params }), _this.exchangeClientId)
                .get("/:id/partial", requestValidator_middleware_1.requestValidatorMiddleware({ params: application_dto_1.Request.GetPartial.Params }), _this.getPartial)
                .post("", requestValidator_middleware_1.requestValidatorMiddleware({ body: application_dto_1.Request.Create.Body }), _this.create);
        };
        _this.create = function (request, response, next) {
            var body = request.body;
            var application = _this.applicationRepository.create({
                name: body.name,
                homeUrl: body.homeUrl,
                callbackUrl: body.callbackUrl,
                clientSecret: crypto_random_string_1.default({ length: 64 }),
            });
            _this.applicationRepository.save(application).then(function (result) {
                _this.applicationRepository.findOneOrFail({ id: result.id }).then(function (application) {
                    winston.debug("Application created --> " + JSON.stringify(application));
                    response.json(application);
                });
            });
        };
        _this.exchangeClientId = function (request, response, next) {
            var params = request.params;
            _this.applicationRepository.findOneOrFail({ clientId: params.clientId }).then(function (application) {
                response.json({
                    kind: "applications.application.id",
                    id: application.id,
                });
            });
        };
        _this.getPartial = function (request, response, next) {
            var params = request.params;
            _this.applicationRepository.findOneOrFail({ id: params.id }).then(function (application) {
                var applicationPartial = application.getPartial();
                response.json(applicationPartial);
            });
        };
        return _this;
    }
    return default_1;
}(controller_interface_1.WebController));
exports.default = default_1;
//# sourceMappingURL=applications.controller.js.map