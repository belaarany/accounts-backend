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

export const requestValidatorMiddleware = (type: any): express.RequestHandler => {
    return (request: express.Request, response: express.Response, next: express.NextFunction): void => {
        validateOrReject(plainToClass(type, request.body), validatorOptions)
        .then(() => {
            next()
        })
        .catch((errors: Array<ValidationError>) => {
            let parsedErrors: object = parseErrors(errors)

            winston.debug(`Request validation failed --> ${JSON.stringify(parsedErrors)}`)

            response
            .status(403)
            .send({
                error: {
                    reason: "Invalid request",
                    errors: parsedErrors,
                }
            })
        })
    }
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
