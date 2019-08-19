"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston = __importStar(require("winston"));
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var errorResponse_1 = require("@helpers/errorResponse");
var validatorOptions = {
    skipMissingProperties: false,
    whitelist: true,
    forbidNonWhitelisted: true,
};
exports.requestValidatorMiddleware = function (schemas) {
    return function (request, response, next) {
        var errorResponse = new errorResponse_1.ErrorResponse(response);
        var paramsValidation = validateSchema.bind(null, schemas.params, request.params, "params");
        var bodyValidation = validateSchema.bind(null, schemas.body, request.body, "body");
        Promise.resolve()
            .then(function () { return paramsValidation(); })
            .then(function () { return bodyValidation(); })
            .then(function () {
            next();
        })
            .catch(function (error) {
            var parsedErrors = parseErrors(error.errors, errorResponse, undefined, undefined, error.schema);
            winston.debug("Request validation failed --> schema: '" + error.schema + "' | errors: '" + JSON.stringify(parsedErrors) + "'");
            errorResponse.setStatusCode(403).send();
        });
    };
};
var validateSchema = function (type, plain, schema) {
    return new Promise(function (resolve, reject) {
        if (type === undefined || type === null || plain === undefined || plain === null) {
            resolve();
        }
        else {
            class_validator_1.validateOrReject(class_transformer_1.plainToClass(type, plain), validatorOptions)
                .then(function () {
                resolve();
            })
                .catch(function (errors) {
                reject({
                    schema: schema,
                    errors: errors,
                });
            });
        }
    });
};
var parseErrors = function (errors, errorResponse, path, parsed, schema) {
    if (path === undefined)
        path = "";
    if (parsed === undefined)
        parsed = {};
    errors.forEach(function (error) {
        if (error.constraints && error.hasOwnProperty("constraints") === true) {
            var _values = Object.values(error.constraints);
            parsed[path + error.property] = _values[0];
            errorResponse.addError({
                source: "request",
                location: schema,
                reason: schema === "params"
                    ? errorResponse_1.ErrorReason.Request.INVALID_PARAMETER_PROPERTY
                    : errorResponse_1.ErrorReason.Request.INVALID_BODY_PROPERTY,
                property: error.property,
                message: _values[0],
            });
        }
        if (error.children && error.hasOwnProperty("children") === true) {
            if (error.children.length > 0) {
                var passPath = error.property + ".";
                if (path.length > 0)
                    passPath = path + "." + passPath;
                parseErrors(error.children, errorResponse, passPath, parsed, schema);
            }
        }
    });
    return parsed;
};
//# sourceMappingURL=requestValidator.middleware.js.map