import * as express from "express"
import * as winston from "winston"

export const corsMiddleware = (): express.RequestHandler => {
	return (request: express.Request, response: express.Response, next: express.NextFunction): void => {
		response.header("Access-Control-Allow-Origin", "*")
		response.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		response.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With")

		next()
	}
}
