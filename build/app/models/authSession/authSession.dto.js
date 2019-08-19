"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var class_validator_1 = require("class-validator");
var authSession_interface_1 = require("@models/authSession/authSession.interface");
var AuthBodySchema;
(function (AuthBodySchema) {
    var Init = /** @class */ (function () {
        function Init() {
        }
        __decorate([
            class_validator_1.IsDefined(),
            class_validator_1.IsIn(["authorization_code"]),
            __metadata("design:type", String)
        ], Init.prototype, "flowType", void 0);
        return Init;
    }());
    AuthBodySchema.Init = Init;
    var Lookup = /** @class */ (function () {
        function Lookup() {
        }
        __decorate([
            class_validator_1.IsDefined(),
            class_validator_1.IsString(),
            __metadata("design:type", String)
        ], Lookup.prototype, "authSessionToken", void 0);
        __decorate([
            class_validator_1.IsDefined(),
            class_validator_1.IsEnum(authSession_interface_1.StepEnum),
            __metadata("design:type", String)
        ], Lookup.prototype, "step", void 0);
        __decorate([
            class_validator_1.IsDefined(),
            class_validator_1.IsString(),
            __metadata("design:type", String)
        ], Lookup.prototype, "identifier", void 0);
        return Lookup;
    }());
    AuthBodySchema.Lookup = Lookup;
    var Challenge = /** @class */ (function () {
        function Challenge() {
        }
        __decorate([
            class_validator_1.IsDefined(),
            class_validator_1.IsString(),
            __metadata("design:type", String)
        ], Challenge.prototype, "authSessionToken", void 0);
        __decorate([
            class_validator_1.IsDefined(),
            class_validator_1.IsEnum(authSession_interface_1.StepEnum),
            __metadata("design:type", String)
        ], Challenge.prototype, "step", void 0);
        __decorate([
            class_validator_1.ValidateIf(function (o) { return o.step === authSession_interface_1.StepEnum.PASSWORD; }),
            class_validator_1.IsDefined(),
            class_validator_1.IsString(),
            __metadata("design:type", String)
        ], Challenge.prototype, "password", void 0);
        return Challenge;
    }());
    AuthBodySchema.Challenge = Challenge;
})(AuthBodySchema = exports.AuthBodySchema || (exports.AuthBodySchema = {}));
var AuthParamsSchema = /** @class */ (function () {
    function AuthParamsSchema() {
    }
    return AuthParamsSchema;
}());
exports.AuthParamsSchema = AuthParamsSchema;
//# sourceMappingURL=authSession.dto.js.map