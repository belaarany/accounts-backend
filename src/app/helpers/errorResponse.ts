import * as express from "express"
import * as winston from "winston"
import uuid from "uuid"

export namespace ErrorReason {
	export enum Account {
		INVALID_PASSWORD = "account.invalidPassword",
		ACCOUNT_NOT_EXISTS = "account.accountNotExists",
		ACCOUNT_ALREADY_EXISTS = "account.accountAlreadyExists",
		INVALID_LOOKUP_METHOD = "account.invalidLookupMethod",
	}

	export enum Authorization {
		ACCESS_DENIED = "authorization.accessDenied",
	}

	export enum Request {
		INVALID_BODY_PROPERTY = "request.body.invalidProperty",
		INVALID_PARAMETER_PROPERTY = "request.params.invalidProperty",
	}

	export enum Server {
		SERVER_ERROR = "server.serverError",
		UNKNOWN = "unknown.unknown",
	}
}

export type ErrorResponseError = {
	source: "request" | "server" | "authorization"
	location?: "header" | "body" | "params" | "query"
	property?: string
	reason: ErrorReason.Account | ErrorReason.Authorization | ErrorReason.Request | ErrorReason.Server
	message: string
}

class ErrorResponse {
	private errors!: Array<ErrorResponseError>
	private code!: number
	private expressResponse: express.Response | undefined
	private uuid!: string

	constructor(expressResponse?: express.Response) {
		if (expressResponse !== undefined) this.expressResponse = expressResponse

		this.reset()
	}

	public reset = (): void => {
		this.errors = []
		this.code = 400
		this.uuid = uuid()
	}

	public addError = (error: ErrorResponseError): ErrorResponse => {
		this.errors.push(error)

		winston.debug(`ErrorResponse (${this.uuid}): addError --> error: ${JSON.stringify(error)}`)

		return this
	}

	public setStatusCode = (code: number): ErrorResponse => {
		this.code = code

		winston.debug(`ErrorResponse (${this.uuid}): setStatusCode --> error: ${code}`)

		return this
	}

	public serialize = (): object => {
		return {
			error: {
				errors: this.errors,
				code: this.code,
				message: (this.errors[0] && this.errors[0].message) || "Unknown error",
				uid: this.uuid,
			},
		}
	}

	public send = (expressResponse?: express.Response): void => {
		if (expressResponse !== undefined) this.expressResponse = expressResponse

		if (this.expressResponse !== undefined) {
			winston.debug(`ErrorResponse (${this.uuid}): send`)

			this.expressResponse.status(this.code).json(this.serialize())

			this.reset()
		} else {
			winston.error("Trying to send an ErrorResponse, however no response object has set")
		}
	}
}

export { ErrorResponse }
