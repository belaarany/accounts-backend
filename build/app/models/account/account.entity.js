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
var etag_1 = __importDefault(require("etag"));
var Account = /** @class */ (function () {
    function Account() {
        this.kind = "accounts.account";
        this.etag = undefined;
        this.name = undefined;
    }
    Account.prototype.AfterAll = function () {
        // Removing private columns
        //delete this.password
        // Generating E-Tag
        this.etag = etag_1.default(JSON.stringify(this));
        // Generating the name
        this.name = [this.firstName, this.lastName].join(" ");
    };
    Account.prototype.getPartial = function () {
        return {
            kind: "accounts.account.partial",
            name: this.name,
            firstName: this.firstName,
            lastName: this.lastName,
            avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS34H69DfFSeutTyf7arnlbXxJ7Ezkx3J8rf7DUoDp6ocQZQrbNcQ",
        };
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn("uuid"),
        __metadata("design:type", String)
    ], Account.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column({
            length: 100,
            nullable: false,
        }),
        __metadata("design:type", String)
    ], Account.prototype, "identifier", void 0);
    __decorate([
        typeorm_1.Column({
            length: 100,
            nullable: false,
            select: false,
        }),
        __metadata("design:type", String)
    ], Account.prototype, "password", void 0);
    __decorate([
        typeorm_1.Column({
            length: 20,
            nullable: false,
            select: false,
        }),
        __metadata("design:type", String)
    ], Account.prototype, "passwordEncryption", void 0);
    __decorate([
        typeorm_1.Column({
            length: 100,
            nullable: false,
        }),
        __metadata("design:type", String)
    ], Account.prototype, "email", void 0);
    __decorate([
        typeorm_1.Column({
            length: 100,
            nullable: false,
        }),
        __metadata("design:type", String)
    ], Account.prototype, "firstName", void 0);
    __decorate([
        typeorm_1.Column({
            length: 100,
            nullable: false,
        }),
        __metadata("design:type", String)
    ], Account.prototype, "lastName", void 0);
    __decorate([
        typeorm_1.CreateDateColumn({
            type: "timestamptz",
        }),
        __metadata("design:type", Date)
    ], Account.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.UpdateDateColumn({
            type: "timestamptz",
        }),
        __metadata("design:type", Date)
    ], Account.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.AfterLoad(),
        typeorm_1.AfterInsert(),
        typeorm_1.AfterUpdate(),
        typeorm_1.AfterRemove(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Account.prototype, "AfterAll", null);
    Account = __decorate([
        typeorm_1.Entity({
            name: "accounts",
        })
    ], Account);
    return Account;
}());
exports.Account = Account;
exports.default = Account;
//# sourceMappingURL=account.entity.js.map