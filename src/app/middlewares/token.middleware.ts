import * as express from "express"
import * as winston from "winston"
import bearerToken from "express-bearer-token"
import { ErrorResponse, ErrorReason } from "@helpers/errorResponse"

export const tokenMiddleware = (): express.RequestHandler[] => [
	bearerToken(),

	(request: express.Request, response: express.Response, next: express.NextFunction): void => {
		const token: string = request.token

		if (request.method == "OPTIONS") {
			winston.debug("Bearer Token: 'OPTIONS' request has been received so ignoring token validation")
			next()
		}
		else {
			if (token !== process.env.APP_DEV_BEARER_TOKEN) {
				winston.error(`Invalid OAuth Authorization (Dev Bearer Token) --> token: ${token}`)

				let errorResponse = new ErrorResponse(response)

				errorResponse
					.addError({
						source: "authorization",
						reason: ErrorReason.Authorization.ACCESS_DENIED,
						message: "Invalid authorization.",
					})
					.setStatusCode(403)
					.send()
			} else {
				next()
			}
		}
	},
]
