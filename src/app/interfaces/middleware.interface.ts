import * as express from "express"
import * as winston from "winston"

type IMiddleware = (request: express.Request, response: express.Response, next: express.NextFunction) => void

export { IMiddleware }
