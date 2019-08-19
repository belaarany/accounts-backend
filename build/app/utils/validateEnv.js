"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var envalid = __importStar(require("envalid"));
var winston = __importStar(require("winston"));
var getEnvs_1 = require("./getEnvs");
var validators = {
    APP_TOKEN_SECRET: envalid.str(),
    APP_PORT: envalid.port(),
    APP_URL: envalid.url(),
    APP_DEV_BEARER_TOKEN: envalid.str(),
    TYPEORM_CONNECTION: envalid.str(),
    TYPEORM_HOST: envalid.host(),
    TYPEORM_PORT: envalid.port(),
    TYPEORM_USERNAME: envalid.str(),
    TYPEORM_PASSWORD: envalid.str(),
    TYPEORM_DATABASE: envalid.str(),
    TYPEORM_SYNCHRONIZE: envalid.bool(),
    TYPEORM_ENTITIES: envalid.str(),
    TYPEORM_MIGRATIONS: envalid.str(),
    TYPEORM_LOGGING: envalid.str(),
};
exports.validators = validators;
var validateEnv = function () {
    var options = {
        reporter: function (result) {
            if (Object.keys(result.errors).length === 0) {
                winston.info("Environment variables loaded successfully");
                var envFiltered = getEnvs_1.getEnvs();
                winston.debug("Env --> " + JSON.stringify(envFiltered));
            }
            else {
                winston.error("Environment variables cannot be loaded: " + JSON.stringify(result.errors));
                throw new Error("Environment variables cannot be loaded");
            }
        }
    };
    envalid.cleanEnv(process.env, validators, options);
};
exports.validateEnv = validateEnv;
//# sourceMappingURL=validateEnv.js.map