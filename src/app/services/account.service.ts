import * as winston from "winston"
import { getRepository, Repository } from "typeorm"
import { Account } from "@models/account/account.entity"
import { AccountDTO } from "@models/account/account.dto"
import { encryptPassword } from "@utils/encryptPassword"
import { AccountException } from "@exceptions"

export class AccountService {
	constructor(private readonly accountRepository: Repository<Account> = getRepository(Account)) {}

	public createAccount = async (dto: AccountDTO.Request.Create.Body): Promise<Account> => {
		try {
			// Referencing https://github.com/typeorm/typeorm/blob/master/docs/find-options.md#basic-options
			let precheckExistingAccount: Account | undefined = await this.accountRepository.findOne({
				where: [{ identifier: dto.identifier }, { email: dto.email }],
			})

			if (precheckExistingAccount !== undefined) {
				throw new AccountException.Duplicated()
			}

			let preparedAccount: Account = this.accountRepository.create({
				identifier: dto.identifier,
				password: encryptPassword(dto.password),
				passwordEncryption: "bcrypt",
				firstName: dto.firstName,
				lastName: dto.lastName,
				email: dto.email,
			})

			let result: Account = await this.accountRepository.save(preparedAccount)

			// Do not return the result directly because it contains the password!
			let account: Account | undefined = await this.accountRepository.findOne({ id: result.id })

			if (account === undefined) {
				throw new Error("Account couldn't be found after creating it")
			}

			winston.debug(`Account created --> ${JSON.stringify(account)}`)

			return account
		} catch (e) {
			if (e instanceof AccountException.Duplicated) {
				throw e
			} else {
				throw new Error("Unknown error")
			}
		}
	}

	public find = async (accountId: string): Promise<Account> => {
		try {
			let account: Account | undefined = await this.accountRepository.findOne({ id: accountId })

			if (account === undefined) {
				throw new AccountException.NotFound()
			}

			return account
		} catch (e) {
			if (e instanceof AccountException.NotFound) {
				throw e
			} else {
				throw new Error("Unknown error")
			}
		}
	}

	public list = async (): Promise<Account[]> => {
		try {
			let accounts: Account[] = await this.accountRepository.find()

			return accounts
		} catch (e) {
			throw new Error("Unknown error")
		}
	}
}
