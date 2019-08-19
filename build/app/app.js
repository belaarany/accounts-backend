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
require("reflect-metadata");
var dotenv = __importStar(require("dotenv"));
var winston = __importStar(require("winston"));
var bodyParser = __importStar(require("body-parser"));
var glob = __importStar(require("glob"));
var path = __importStar(require("path"));
var express_1 = __importDefault(require("express"));
var typeorm_1 = require("typeorm");
var _middlewares_1 = require("@middlewares");
var createWinston_1 = require("@utils/createWinston");
var validateEnv_1 = require("@utils/validateEnv");
var App = /** @class */ (function () {
    function App() {
    }
    App.prototype.bootstrap = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._applicationStart = Date.now();
            // Pre-requirements
            _this.registerWinstonLogger();
            winston.info("Application booting...");
            // Express
            _this.express = express_1.default();
            // After-requirements
            _this.registerEnvironmentVariables();
            _this.registerMiddlewares();
            // Requirements that use promise
            Promise.all([_this.createDatabaseConnection()])
                .then(function (results) {
                var connection = results[0];
                _this.databaseConnection = connection;
                // Requirements that use database
                return _this.registerControllers();
            })
                .then(function () {
                winston.info("Application booted in " + (Date.now() - _this._applicationStart) + " ms");
                resolve(_this.getApp());
            })
                .catch(function (error) {
                winston.error("Application cannot boot, error occurred");
                winston.debug("Application boot --> " + JSON.stringify(error) + " | " + error);
            });
        });
    };
    App.prototype.getApp = function () {
        return this;
    };
    App.prototype.getExpress = function () {
        return this.express;
    };
    App.prototype.getDatabaseConnection = function () {
        return this.databaseConnection;
    };
    App.prototype.registerWinstonLogger = function () {
        createWinston_1.createWinston();
    };
    App.prototype.registerEnvironmentVariables = function () {
        dotenv.config();
        validateEnv_1.validateEnv();
    };
    App.prototype.registerMiddlewares = function () {
        this.express.use(bodyParser.json());
        this.express.use(_middlewares_1.corsMiddleware());
        this.express.use(_middlewares_1.httpDebugMiddleware());
        this.express.use(_middlewares_1.tokenMiddleware());
        this.express.use(_middlewares_1.postProcessResponseMiddleware());
        this.express.use(_middlewares_1.preProcessRequestMiddleware());
    };
    App.prototype.registerControllers = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            Promise.all(glob.sync(__dirname + "/controllers/**/*.controller.ts").map(function (file) {
                winston.debug("Controller found --> file: '" + path.basename(file) + "'");
                return Promise.resolve().then(function () { return __importStar(require(file)); });
            })).then(function (controllers) {
                controllers.forEach(function (controller) {
                    var _defaultExport = controller.default;
                    var _class = new _defaultExport();
                    _class.registerRoutes();
                    _this.express.use(_class.path, _class.router);
                    winston.debug("Controller imported --> path: '" + _class.path + "'");
                });
                winston.info("Controllers imported");
                resolve();
            });
        });
    };
    App.prototype.createDatabaseConnection = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            typeorm_1.createConnection()
                .then(function (connection) {
                winston.info("Database connection successfully initiated");
                winston.debug("Database connection --> type: '" + connection.options.type + "' | database: '" + connection.options.database + "'");
                _this.databaseConnection = connection;
                resolve(connection);
            })
                .catch(function (error) {
                winston.error("Database connection failed: '" + error + "'");
                winston.debug(JSON.stringify(error));
                reject(error);
            });
        });
    };
    return App;
}());
exports.App = App;
//# sourceMappingURL=app.js.map