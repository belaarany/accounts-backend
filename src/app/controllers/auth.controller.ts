import * as express from "express"
import * as winston from "winston"
import * as url from "url"
import * as tokenHandler from "@utils/tokenHandler"
import moment from "moment"
import { Controller, WebController } from "~app/interfaces/controller.interface"
import { requestValidatorMiddleware } from "@middlewares/requestValidator.middleware"
import { ErrorResponseError, ErrorReason } from "@helpers/errorResponse"

import { AuthSession } from "@models/authSession/authSession.entity"
import { AuthSessionService } from "@models/authSession/authSession.service"
import { AuthSessionDTO } from "@models/authSession/authSession.dto"
import { AuthSessionException } from "@exceptions"
import { Step, StepEnum, NextStep } from "@models/authSession/authSession.interface"
import { Account } from "@models/account/account.entity"
import { AccountService } from "@models/account/account.service"
import { AccountException } from "@exceptions"

export default class extends WebController implements Controller {
	public path: string = "/authentication"

	constructor(
		private readonly authSessionService: AuthSessionService = new AuthSessionService(),
		private readonly accountService: AccountService = new AccountService(),
	) {
		super()
	}

	public registerRoutes = (): void => {
		this.router
			.post("/init", requestValidatorMiddleware({ body: AuthSessionDTO.Request.Init.Body }), this.handleInit)
			.post("/lookup", requestValidatorMiddleware({ body: AuthSessionDTO.Request.Lookup.Body }), this.handleLookup)
			.post("/challenge", requestValidatorMiddleware({ body: AuthSessionDTO.Request.Challenge.Body }), this.handleChallenge)
	}

	public handleInit = async (request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> => {
		try {
			let body: AuthSessionDTO.Request.Init.Body = request.body

			let authSession: { authSessionId: string; valudUntil: Date } = await this.authSessionService.initialize({
				flowType: body.flowType || null,
			})
			await this.authSessionService.addCompleted(authSession.authSessionId, StepEnum.INIT)
			let nextSteps: NextStep[] = await this.authSessionService.getNextSteps(authSession.authSessionId, this.path)

			let responseBody: AuthSessionDTO.Response.Init.Body = {
				authenticated: false,
				authSessionToken: tokenHandler.encode(authSession.authSessionId),
				validUntil: moment(authSession.valudUntil).format(),
				nextSteps: nextSteps,
			}

			response.json(responseBody)
		} catch (e) {
			this.errorResponse
				.addError({
					source: "server",
					reason: ErrorReason.Server.UNKNOWN,
					message: "Unknown error occurred.",
				})
				.send(response)
		}
	}

	public handleLookup = async (request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> => {
		try {
			let body: AuthSessionDTO.Request.Lookup.Body = request.body
			let authSessionId: string = tokenHandler.decode(body.authSessionToken).oid

			switch (body.step) {
				case StepEnum.IDENTIFIER: {
					let account: Account = await this.accountService.find({ identifier: body.identifier })
					await this.authSessionService.assignAccountToSession(account.id, authSessionId)
					await this.authSessionService.addCompleted(authSessionId, StepEnum.IDENTIFIER)
					let nextSteps: NextStep[] = await this.authSessionService.getNextSteps(authSessionId, this.path)

					let responseBody: AuthSessionDTO.Response.Lookup.Body = {
						authenticated: false,
						nextSteps: nextSteps,
						account: account.getPartial(),
					}

					response.json(responseBody)

					break
				}

				default: {
					throw new Error("Unknown step")
				}
			}
		} catch (e) {
			if (e instanceof AccountException.NotFound) {
				this.errorResponse.addError(e.getErrorResponseError()).send(response)
			}

			this.errorResponse
				.addError({
					source: "server",
					reason: ErrorReason.Server.UNKNOWN,
					message: "Unknown error occurred.",
				})
				.send(response)
		}
	}

	public handleChallenge = async (request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> => {
		try {
			let body: AuthSessionDTO.Request.Challenge.Body = request.body
			let authSessionId: string = tokenHandler.decode(body.authSessionToken).oid

			switch (body.step) {
				case StepEnum.PASSWORD: {
					let authSession: AuthSession = await this.authSessionService.find(authSessionId)
					await this.accountService.validatePassword(authSession.accountId, body.password)
					await this.authSessionService.addCompleted(authSessionId, StepEnum.PASSWORD)
					await this.authSessionService.markSessionAsDone(authSessionId)

					let responseBody: AuthSessionDTO.Response.Challenge.Body = {
						authenticated: true,
						flowType: "authorization_code",
						code: "soon_" + Date.now(),
					}

					response.json(responseBody)

					break
				}

				default: {
					this.errorResponse
						.addError({
							source: "request",
							location: "params",
							reason: ErrorReason.Request.INVALID_PARAMETER_PROPERTY,
							property: "method",
							message: "Unknown parameter 'method' property has been passed.",
						})
						.send()
				}
			}
		} catch (e) {
			if (e instanceof AccountException.InvalidPassword) {
				this.errorResponse.addError(e.getErrorResponseError()).send(response)
			}

			this.errorResponse
				.addError({
					source: "server",
					reason: ErrorReason.Server.UNKNOWN,
					message: "Unknown error occurred.",
				})
				.send(response)
		}
	}
}
