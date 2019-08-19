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
Object.defineProperty(exports, "__esModule", { value: true });
var command_interface_1 = require("../../interfaces/command.interface");
var clear = require("clear");
var fs = require("fs");
var path = require("path");
module.exports = /** @class */ (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.action = function (args, done) {
            var migrationsPath = path.dirname(require.main.filename) + "/../app/migrations/";
            var now = String(Date.now());
            var name = args.name.toLowerCase();
            var fileName = now + "_" + name + ".ts";
            var content = "import { MigrationInterface, QueryRunner, Table, TableIndex, TableColumn, TableForeignKey } from \"typeorm\"\n\nexport default class " + name + "_" + now + " implements MigrationInterface {\n    \n    async up(queryRunner: QueryRunner): Promise<any> {\n         \n    }\n\n    async down(queryRunner: QueryRunner): Promise<any> {\n        \n    }\n    \n}\n";
            if (args.options.t && args.options.t === "table") {
                migrationsPath += "tables/";
            }
            else {
                migrationsPath += "changes/";
            }
            fs.writeFile(migrationsPath + fileName, content, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
                done();
            });
        };
        return _this;
    }
    class_1.prototype.load = function (props) {
        this.app = props.app;
        props.cli
            .command("migrate:create <name>")
            .alias("m:c")
            .description("Creates a migration")
            .option("-t <type>", "Type of the migration (table | change)")
            .action(this.action);
    };
    return class_1;
}(command_interface_1.ACommand));
//# sourceMappingURL=create.cmd.js.map