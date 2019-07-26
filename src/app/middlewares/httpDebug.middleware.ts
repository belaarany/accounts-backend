import * as express from "express"
import * as winston from "winston"

export const httpDebugMiddleware = (): express.RequestHandler => {
    return (request: express.Request, response: express.Response, next: express.NextFunction): void => {
        winston.http(`Endpoint has been called: ${request.method} ${request.url}`)

        winston.debug(`${request.method} ${request.url} --> params: ${JSON.stringify(request.params)} | query: ${JSON.stringify(request.query)} | body: ${JSON.stringify(request.body)}`)

        next()
    }
}
