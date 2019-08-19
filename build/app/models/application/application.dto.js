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
var Request;
(function (Request) {
    var Create;
    (function (Create) {
        var Body = /** @class */ (function () {
            function Body() {
            }
            __decorate([
                class_validator_1.IsDefined(),
                class_validator_1.Length(3, 200),
                __metadata("design:type", String)
            ], Body.prototype, "name", void 0);
            __decorate([
                class_validator_1.IsDefined(),
                class_validator_1.IsUrl(),
                __metadata("design:type", String)
            ], Body.prototype, "homeUrl", void 0);
            __decorate([
                class_validator_1.IsDefined(),
                class_validator_1.IsUrl(),
                __metadata("design:type", String)
            ], Body.prototype, "callbackUrl", void 0);
            return Body;
        }());
        Create.Body = Body;
    })(Create = Request.Create || (Request.Create = {}));
    var GetPartial;
    (function (GetPartial) {
        var Params = /** @class */ (function () {
            function Params() {
            }
            __decorate([
                class_validator_1.IsDefined(),
                class_validator_1.IsUUID("4"),
                __metadata("design:type", String)
            ], Params.prototype, "id", void 0);
            return Params;
        }());
        GetPartial.Params = Params;
    })(GetPartial = Request.GetPartial || (Request.GetPartial = {}));
    var ExchangeClientId;
    (function (ExchangeClientId) {
        var Params = /** @class */ (function () {
            function Params() {
            }
            __decorate([
                class_validator_1.IsDefined(),
                class_validator_1.IsHexadecimal(),
                class_validator_1.Length(32, 32),
                __metadata("design:type", String)
            ], Params.prototype, "clientId", void 0);
            return Params;
        }());
        ExchangeClientId.Params = Params;
    })(ExchangeClientId = Request.ExchangeClientId || (Request.ExchangeClientId = {}));
})(Request = exports.Request || (exports.Request = {}));
//# sourceMappingURL=application.dto.js.map