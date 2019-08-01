import * as express from "express"
import * as winston from "winston"
import * as mung from "express-mung"
import camelcaseKeys from "camelcase-keys"
import snakecaseKeys from "snakecase-keys"

export const preProcessRequestMiddleware = (): express.RequestHandler => {
    return (request: express.Request, response: express.Response, next: express.NextFunction): void => {
        request.query = camelcaseKeys(request.query)
        request.body = camelcaseKeys(request.body)

        next()
    }
}

export const postProcessResponseMiddleware = (): express.RequestHandler => {
    return mung.json((body: express.Request["body"], request: express.Request, response: express.Response) => {
        return snakecaseKeys(body)
    })
}
