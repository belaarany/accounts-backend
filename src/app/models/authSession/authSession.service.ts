import * as url from "url"
import moment from "moment"
import { getRepository, Repository } from "typeorm"
import { GlobalException } from "@exceptions"

import { AuthSession } from "@models/authSession/authSession.entity"
import { AuthSessionException } from "@exceptions"
import { Step, StepEnum, NextStep } from "@models/authSession/authSession.interface"
import { Account } from "@models/account/account.entity"
import { AccountService } from "@models/account/account.service"
import { AccountException } from "@exceptions"

export class AuthSessionService {
	constructor(
		private readonly authSessionRepository: Repository<AuthSession> = getRepository(AuthSession),
		private readonly accountService: AccountService = new AccountService(),
	) {}

	public find = async (authSessionId: string): Promise<AuthSession> => {
		try {
			let authSession: AuthSession | undefined = await this.authSessionRepository.findOne({ id: authSessionId })

			if (authSession === undefined) {
				throw new AuthSessionException.InvalidFlowType()
			}

			return authSession
		} catch (e) {
			if (e instanceof AuthSessionException.InvalidFlowType) {
				throw e
			}

			throw new GlobalException.Unknown(null, "authSessionService.find", e)
		}
	}

	public initialize = async (data: { flowType: "authorization_code", clientId?: string }): Promise<{ authSessionId: string; valudUntil: Date }> => {
		try {
			if (data.flowType !== "authorization_code") {
				throw new AuthSessionException.InvalidFlowType()
			}

			let authSessionPrepared: AuthSession = this.authSessionRepository.create({
				validUntil: moment()
					.add(1, "hours")
					.format(),
				authenticatedAt: null,
				flowType: data.flowType,
				clientId: data.clientId || null,
			})

			let authSession: AuthSession = await this.authSessionRepository.save(authSessionPrepared)

			return {
				authSessionId: authSession.id,
				valudUntil: authSession.validUntil,
			}
		} catch (e) {
			if (e instanceof AuthSessionException.InvalidFlowType) {
				throw e
			}

			throw new GlobalException.Unknown(null, "authSessionService.initialize", e)
		}
	}

	public addCompleted = async (authSessionId: string, step: Step): Promise<void> => {
		try {
			let authSession: AuthSession | undefined = await this.authSessionRepository.findOne({ id: authSessionId })

			if (authSession === undefined) {
				throw new AuthSessionException.SessionNotExists()
			}

			await this.authSessionRepository.update(
				{ id: authSessionId },
				{
					stepsCompleted: {
						...authSession.stepsCompleted,
						[step]: moment.utc().format(),
					},
				},
			)

			return
		} catch (e) {
			if (e instanceof AuthSessionException.SessionNotExists) {
				throw e
			}

			throw new GlobalException.Unknown(null, "authSessionService.addCompleted", e)
		}
	}

	public getNextSteps = async (authSessionId: string, urlPath: string): Promise<NextStep[]> => {
		try {
			let authSession: AuthSession | undefined = await this.authSessionRepository.findOne({ id: authSessionId })

			if (authSession === undefined) {
				throw new AuthSessionException.SessionNotExists()
			}

			// @ts-ignore
			let stepsCompleted: Array<Step> = Object.keys(authSession.stepsCompleted)

			if (stepsCompleted.length === 1) {
				if (stepsCompleted[0] === StepEnum.INIT) {
					return [
						{
							step: StepEnum.IDENTIFIER,
							url: url.resolve(process.env.APP_URL, [urlPath, "lookup"].join("/")),
						},
					]
				} else {
					throw new Error("Unhandled step #1")
				}
			} else if (stepsCompleted.length > 1) {
				if (stepsCompleted.length === 2) {
					if (stepsCompleted[0] === StepEnum.INIT && stepsCompleted[1] === StepEnum.IDENTIFIER) {
						return [
							{
								step: StepEnum.PASSWORD,
								url: url.resolve(process.env.APP_URL, [urlPath, "challenge"].join("/")),
							},
						]
					} else {
						throw new Error("Unhandled step #2")
					}
				} else {
					throw new Error("Unhandled step #3")
				}
			}

			// If no steps has been done then it's a bug
			else {
				throw new Error("Unhandled step #4")
			}
		} catch (e) {
			if (e instanceof AuthSessionException.SessionNotExists) {
				throw e
			}

			throw new GlobalException.Unknown(null, "authSessionService.getNextSteps", e)
		}
	}

	public assignAccountToSession = async (accountId: string, authSessionId: string): Promise<void> => {
		try {
			await this.authSessionRepository.update({ id: authSessionId }, { accountId: accountId })
		} catch (e) {
			throw new GlobalException.Unknown(null, "authSessionService.assingAccountToSession", e)
		}
	}

	public markSessionAsDone = async (authSessionId: string): Promise<void> => {
		try {
			await this.authSessionRepository.update({ id: authSessionId }, { authenticatedAt: moment().format() })
		} catch (e) {
			throw new GlobalException.Unknown(null, "authSessionService.markSessionAsDone", e)
		}
	}
}
