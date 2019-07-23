import * as express from "express"
import * as winston from "winston"
import { IMiddleware } from "../interfaces/middleware.interface"

const httpDebugMiddleware = (request: express.Request, response: express.Response, next: express.NextFunction): void => {
    winston.http("An endpoint has been called... middleware")

    next()
}

export { httpDebugMiddleware }
