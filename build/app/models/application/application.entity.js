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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var md5_1 = __importDefault(require("md5"));
var etag_1 = __importDefault(require("etag"));
var Application = /** @class */ (function () {
    function Application() {
        this.kind = "applications.application";
        this.etag = undefined;
    }
    Application.prototype.AfterAll = function () {
        // Generating E-Tag
        this.etag = etag_1.default(JSON.stringify(this));
    };
    Application.prototype.BeforeInsert = function () {
        // Client ID
        this.clientId = md5_1.default([Date.now(), Math.floor(10000 + Math.random() * 89998)].join(":"));
    };
    Application.prototype.getPartial = function () {
        return {
            kind: "applications.application.partial",
            name: this.name,
            homeUrl: this.homeUrl,
            callbackUrl: this.callbackUrl,
        };
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn("uuid"),
        __metadata("design:type", String)
    ], Application.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column({
            length: 300,
            nullable: false,
        }),
        __metadata("design:type", String)
    ], Application.prototype, "name", void 0);
    __decorate([
        typeorm_1.Column({
            length: 300,
            nullable: false,
        }),
        __metadata("design:type", String)
    ], Application.prototype, "clientId", void 0);
    __decorate([
        typeorm_1.Column({
            length: 100,
            nullable: false,
        }),
        __metadata("design:type", String)
    ], Application.prototype, "clientSecret", void 0);
    __decorate([
        typeorm_1.Column({
            length: 300,
            nullable: false,
        }),
        __metadata("design:type", String)
    ], Application.prototype, "homeUrl", void 0);
    __decorate([
        typeorm_1.Column({
            length: 300,
            nullable: false,
        }),
        __metadata("design:type", String)
    ], Application.prototype, "callbackUrl", void 0);
    __decorate([
        typeorm_1.CreateDateColumn({
            type: "timestamptz",
        }),
        __metadata("design:type", Date)
    ], Application.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.UpdateDateColumn({
            type: "timestamptz",
        }),
        __metadata("design:type", Date)
    ], Application.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.AfterLoad(),
        typeorm_1.AfterInsert(),
        typeorm_1.AfterUpdate(),
        typeorm_1.AfterRemove(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Application.prototype, "AfterAll", null);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Application.prototype, "BeforeInsert", null);
    Application = __decorate([
        typeorm_1.Entity({
            name: "applications",
        })
    ], Application);
    return Application;
}());
exports.Application = Application;
exports.default = Application;
//# sourceMappingURL=application.entity.js.map