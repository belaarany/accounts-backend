import * as express from "express"
import * as winston from "winston"
import { IMiddleware } from "../interfaces/middleware.interface"

const httpDebugMiddleware = (request: express.Request, response: express.Response, next: express.NextFunction): void => {
    winston.http(`An endpoint has been called: ${request.method} ${request.url}`)

    winston.debug(`${request.method} ${request.url} --> params: ${JSON.stringify(request.params)} | query: ${JSON.stringify(request.query)} | body: ${JSON.stringify(request.body)}`)

    next()
}

export { httpDebugMiddleware }
