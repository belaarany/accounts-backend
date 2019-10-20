import * as express from "express"
import * as winston from "winston"
import * as url from "url"
import * as tokenHandler from "@utils/tokenHandler"
import moment from "moment"
import { getRepository, Repository } from "typeorm"
import { Controller, WebController } from "~app/interfaces/controller.interface"
import { requestValidatorMiddleware } from "@middlewares/requestValidator.middleware"
import { AuthSession } from "@models/authSession/authSession.entity"
import { AuthParamsSchema, AuthBodySchema, AuthResponseBody, AuthSessionDTO } from "@models/authSession/authSession.dto"
import { Account } from "@models/account/account.entity"
import { Step, StepEnum } from "@models/authSession/authSession.interface"
import { ErrorResponseError, ErrorReason } from "@helpers/errorResponse"
import { encryptPassword, validatePassword } from "@utils/encryptPassword"
import { AuthSessionService } from "@models/authSession/authSession.service"

export default class extends WebController implements Controller {
	public path: string = "/authentication"

	constructor(
		private readonly authSessionRepository: Repository<AuthSession> = getRepository(AuthSession),
		private readonly accountRepository: Repository<Account> = getRepository(Account),
		private readonly authSessionService: AuthSessionService = new AuthSessionService(),
	) {
		super()
	}

	public registerRoutes = (): void => {
		this.router
			.post("/init", requestValidatorMiddleware({ body: AuthSessionDTO.Request.Init.Body }), this.handleInit)
			.post("/lookup", requestValidatorMiddleware({ params: AuthParamsSchema, body: AuthBodySchema.Lookup }), this.handleLookup)
			.post("/challenge", requestValidatorMiddleware({ params: AuthParamsSchema, body: AuthBodySchema.Challenge }), this.handleChallenge)
	}

	public handleInit = async (request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> => {
		let body: AuthSessionDTO.Request.Init.Body = request.body

		try {
			let authSession: { authSessionId: string; valudUntil: Date } = await this.authSessionService.initialize({ flowType: body.flowType || null })
		} catch (e) {}
	}

	public _handleInit = async (request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> => {
		let body: AuthBodySchema.Init = request.body

		try {
			let authSession: { authSessionId: string; valudUntil: Date } = await this.initializeSession({ flowType: body.flowType || null })
			await this.addCompleted(authSession.authSessionId, StepEnum.INIT)
			let nextSteps: AuthResponseBody["nextSteps"] = await this.getNexts(authSession.authSessionId)

			let responseBody: AuthResponseBody = {
				authenticated: false,
				authSessionToken: tokenHandler.encode(authSession.authSessionId),
				validUntil: moment(authSession.valudUntil).format(),
				nextSteps: nextSteps,
			}

			response.json(responseBody)
		} catch (e) {
			this.errorResponse.addError(e).send(response)
		}
	}

	public handleLookup = async (request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> => {
		let body: AuthBodySchema.Lookup = request.body
		let authSessionId: string = tokenHandler.decode(body.authSessionToken).oid

		switch (body.step) {
			case StepEnum.IDENTIFIER: {
				try {
					let account: Account = await this.lookupAccount("regular", body.identifier)
					await this.assignAccountToSession(account.id, authSessionId)
					await this.addCompleted(authSessionId, StepEnum.IDENTIFIER)
					let nextSteps: AuthResponseBody["nextSteps"] = await this.getNexts(authSessionId)

					let responseBody: AuthResponseBody = {
						authenticated: false,
						nextSteps: nextSteps,
						account: account.getPartial(),
					}

					response.json(responseBody)
				} catch (e) {
					this.errorResponse.addError(e).send(response)
				}

				break
			}
		}
	}

	public handleChallenge = async (request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> => {
		let body: AuthBodySchema.Challenge = request.body
		let authSessionId: string = tokenHandler.decode(body.authSessionToken).oid

		switch (body.step) {
			case StepEnum.PASSWORD: {
				try {
					let accountId: string = await this.getAccountIdBySession(authSessionId)
					await this.validatePassword(accountId, body.password)
					await this.addCompleted(authSessionId, StepEnum.PASSWORD), await this.markSessionAsDone(authSessionId)

					let responseBody: AuthResponseBody = {
						authenticated: true,
						flowType: "authorization_code",
						code: "soon_" + Date.now(),
					}

					response.json(responseBody)
				} catch (e) {
					this.errorResponse.addError(e).send(response)
				}

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
	}

	private getNexts = (authSessionId: string): Promise<AuthResponseBody["nextSteps"]> => {
		return new Promise((resolve: (nextSteps: AuthResponseBody["nextSteps"]) => void, reject: Function) => {
			this.authSessionRepository.findOne({ id: authSessionId }).then((authSession: AuthSession) => {
				// @ts-ignore
				let stepsCompleted: Array<Step> = Object.keys(authSession.stepsCompleted)

				if (stepsCompleted.length === 1) {
					if (stepsCompleted[0] === StepEnum.INIT) {
						resolve([
							{
								step: StepEnum.IDENTIFIER,
								url: url.resolve(process.env.APP_URL, [this.path, "lookup"].join("/")),
							},
						])
					} else {
						reject("1")
					}
				} else if (stepsCompleted.length > 1) {
					if (stepsCompleted.length === 2) {
						if (stepsCompleted[0] === StepEnum.INIT && stepsCompleted[1] === StepEnum.IDENTIFIER) {
							resolve([
								{
									step: StepEnum.PASSWORD,
									url: url.resolve(process.env.APP_URL, [this.path, "challenge"].join("/")),
								},
							])
						} else {
							reject("2")
						}
					} else {
						reject("3")
					}
				}

				// If no steps has been done then it's a bug
				else {
					reject("4")
				}
			})
		})
	}

	private initializeSession = (data: { flowType: AuthBodySchema.Init["flowType"] }): Promise<{ authSessionId: string; valudUntil: Date }> => {
		return new Promise((resolve: (data: { authSessionId: string; valudUntil: Date }) => void, reject: () => void) => {
			let authSession: AuthSession = this.authSessionRepository.create({
				validUntil: moment()
					.add(1, "hours")
					.format(),
				authenticatedAt: null,
				flowType: data.flowType,
			})

			this.authSessionRepository.save(authSession).then((result: AuthSession) => {
				resolve({
					authSessionId: result.id,
					valudUntil: result.validUntil,
				})
			})
		})
	}

	private lookupAccount = (by: "regular" | "one-time", identifier: string): Promise<Account> => {
		return new Promise((resolve: (account: Account) => void, reject: (error: ErrorResponseError) => void) => {
			switch (by) {
				case "regular": {
					this.accountRepository
						.findOneOrFail({ identifier: identifier })
						.then((account: Account) => {
							resolve(account)
						})
						.catch(() => {
							reject({
								source: "request",
								reason: ErrorReason.Account.ACCOUNT_NOT_EXISTS,
								message: "This Account does not exist.",
							})
						})

					break
				}

				default: {
					reject({
						source: "server",
						reason: ErrorReason.Account.INVALID_LOOKUP_METHOD,
						message: "Invalid Account lookup method has been requested.",
					})
				}
			}
		})
	}

	private getAccountIdBySession = (authSessionId: string): Promise<string> => {
		return new Promise((resolve: (accountId: string) => void, reject: () => void) => {
			this.authSessionRepository.findOne({ id: authSessionId }).then((authSession: AuthSession) => {
				resolve(authSession.accountId)
			})
		})
	}

	private assignAccountToSession = (accountId: string, authSessionId: string): Promise<void> => {
		return new Promise((resolve: () => void, reject: () => void) => {
			this.authSessionRepository.update({ id: authSessionId }, { accountId: accountId }).then(() => {
				resolve()
			})
		})
	}

	private addCompleted = (authSessionId: string, step: Step): Promise<void> => {
		return new Promise((resolve: () => void, reject: () => void) => {
			this.authSessionRepository.findOne({ id: authSessionId }).then((authSession: AuthSession) => {
				this.authSessionRepository
					.update(
						{ id: authSessionId },
						{
							stepsCompleted: {
								...authSession.stepsCompleted,
								[step]: moment.utc().format(),
							},
						},
					)
					.then(() => {
						resolve()
					})
			})
		})
	}

	private validatePassword = (accountId: string, plainPassword: string): Promise<void> => {
		return new Promise((resolve: () => void, reject: (error: ErrorResponseError) => void) => {
			this.accountRepository
				.createQueryBuilder("account")
				.addSelect("account.password")
				.where({ id: accountId })
				.getOne()
				.then((account: Account) => {
					if (
						account !== undefined &&
						account !== null &&
						Array.isArray(account) === false &&
						typeof account === "object" &&
						Object.keys(account).length > 0 &&
						account.hasOwnProperty("kind") === true &&
						account.hasOwnProperty("password") === true
					) {
						if (validatePassword(plainPassword, account.password) === true) {
							resolve()
						} else {
							throw Error()
						}
					} else {
						throw Error()
					}
				})
				.catch(() => {
					reject({
						source: "request",
						message: "Invalid password",
						reason: ErrorReason.Account.INVALID_PASSWORD,
					})
				})
		})
	}

	private markSessionAsDone = (authSessionId: string): Promise<void> => {
		return new Promise((resolve: () => void, reject: () => void) => {
			this.authSessionRepository
				.update({ id: authSessionId }, { authenticatedAt: moment().format() })
				.then(() => {
					resolve()
				})
				.catch(err => {
					console.log({ err })
					reject()
				})
		})
	}
}
