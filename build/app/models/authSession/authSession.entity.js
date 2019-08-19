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
var typeorm_1 = require("typeorm");
var AuthSession = /** @class */ (function () {
    function AuthSession() {
        this.isAuthenticated = undefined;
    }
    AuthSession.prototype.AfterAll = function () {
        // Is Authenticated
        this.isAuthenticated = this.authenticatedAt === undefined || this.authenticatedAt === null ? false : true;
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn("uuid"),
        __metadata("design:type", String)
    ], AuthSession.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column({
            length: 100,
            nullable: true,
            default: null,
        }),
        __metadata("design:type", String)
    ], AuthSession.prototype, "accountId", void 0);
    __decorate([
        typeorm_1.Column({
            type: "simple-json",
            nullable: true,
            default: null,
        }),
        __metadata("design:type", Object)
    ], AuthSession.prototype, "stepsCompleted", void 0);
    __decorate([
        typeorm_1.Column({
            length: 30,
            nullable: true,
            default: null,
        }),
        __metadata("design:type", String)
    ], AuthSession.prototype, "flowType", void 0);
    __decorate([
        typeorm_1.Column({
            type: "timestamptz",
            nullable: false,
        }),
        __metadata("design:type", Date)
    ], AuthSession.prototype, "validUntil", void 0);
    __decorate([
        typeorm_1.Column({
            type: "timestamptz",
            nullable: true,
            default: null,
        }),
        __metadata("design:type", Date)
    ], AuthSession.prototype, "authenticatedAt", void 0);
    __decorate([
        typeorm_1.CreateDateColumn({
            type: "timestamptz",
        }),
        __metadata("design:type", Date)
    ], AuthSession.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.UpdateDateColumn({
            type: "timestamptz",
        }),
        __metadata("design:type", Date)
    ], AuthSession.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.AfterLoad(),
        typeorm_1.AfterInsert(),
        typeorm_1.AfterUpdate(),
        typeorm_1.AfterRemove(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], AuthSession.prototype, "AfterAll", null);
    AuthSession = __decorate([
        typeorm_1.Entity({
            name: "authSessions",
        })
    ], AuthSession);
    return AuthSession;
}());
exports.AuthSession = AuthSession;
exports.default = AuthSession;
//# sourceMappingURL=authSession.entity.js.map