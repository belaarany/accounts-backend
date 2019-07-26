import * as express from "express"

type IMiddleware = (request: express.Request, response: express.Response, next: express.NextFunction) => void

export { IMiddleware }
