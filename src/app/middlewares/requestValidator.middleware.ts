import * as express from "express"
import * as winston from "winston"
import { validateOrReject, ValidationError, ValidatorOptions  } from "class-validator"
import { plainToClass } from "class-transformer"

const validatorOptions: ValidatorOptions = {
    skipMissingProperties: false,
    whitelist: true,
    forbidNonWhitelisted: true,
}

export interface ParsedErrors {
    [property: string]: string,
}

export const requestValidatorMiddleware = (schemas: { params?: any, body?: any }): express.RequestHandler => {
    return (request: express.Request, response: express.Response, next: express.NextFunction): void => {
        let paramsValidation = validateSchema.bind(null, schemas.params, request.params, "params")
        let bodyValidation = validateSchema.bind(null, schemas.body, request.body, "body")

        Promise.resolve()
        .then(() => paramsValidation())
        .then(() => bodyValidation())
        .then(() => {
            next()
        })
        .catch((error: { schema: "params" | "body", errors: Array<ValidationError> }) => {
            let parsedErrors: object = parseErrors(error.errors)

            winston.debug(`Request validation failed --> schema: '${error.schema}' | errors: '${JSON.stringify(parsedErrors)}'`)

            response
            .status(403)
            .send({
                error: {
                    reason: "Invalid request",
                    location: error.schema,
                    errors: parsedErrors,
                }
            })
        })
    }
}

const validateSchema = (type: any, plain: Array<{}>, schema: "params" | "body"): Promise<any> => {
    return new Promise((resolve: () => void, reject: (error: { schema: "params" | "body", errors: Array<ValidationError> }) => void) => {
        if (type === undefined || type === null || plain === undefined || plain === null) {
            resolve()
        }

        validateOrReject(plainToClass(type, plain), validatorOptions)
        .then(() => {
            resolve()
        })
        .catch((errors: Array<ValidationError>) => {
            reject({
                schema: schema,
                errors: errors,
            })
        })
    })
}

const parseErrors = (errors: Array<ValidationError>, path?: string, parsed?: {}): object => {
    if (path === undefined) path = ""
    if (parsed === undefined) parsed = {}

    errors.forEach((error: ValidationError) => {
        if (error.constraints && error.hasOwnProperty("constraints") === true) {
            let _values: Array<string> = Object.values(error.constraints)
            parsed[path + error.property] = _values.length > 1 ? _values : _values[0]
        }

        if (error.children && error.hasOwnProperty("children") === true) {
            if (error.children.length > 0) {
                let passPath: string = error.property + "."

                if (path.length > 0) passPath = path + "." + passPath

                parseErrors(error.children, passPath , parsed)
            }
        }
    })

    return parsed
}
