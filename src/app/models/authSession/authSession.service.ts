import { getRepository, Repository } from "typeorm"
import moment from "moment"

import { AuthSession } from "@models/authSession/authSession.entity"
import { AuthSessionException } from "@exceptions"
import { Step, StepEnum } from "@models/authSession/authSession.interface"
import { Account } from "@models/account/account.entity"
import { AccountService } from "@models/account/account.service"
import { AccountException } from "@exceptions"

export class AuthSessionService {
	constructor(
		private readonly authSessionRepository: Repository<AuthSession> = getRepository(AuthSession),
		private readonly accountService: AccountService = new AccountService(),
	) {}

	public initialize = async (data: { flowType: "authorization_code" }): Promise<{ authSessionId: string; valudUntil: Date }> => {
		try {
			let authSessionPrepared: AuthSession = await this.authSessionRepository.create({
				validUntil: moment()
					.add(1, "hours")
					.format(),
				authenticatedAt: null,
				flowType: data.flowType,
			})

			let authSession: AuthSession = await this.authSessionRepository.save(authSessionPrepared)

			return {
				authSessionId: authSession.id,
				valudUntil: authSession.validUntil,
			}
		} catch (e) {
			throw new Error("Unknown error")
		}
	}
}
