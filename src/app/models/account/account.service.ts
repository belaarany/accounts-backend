import * as winston from "winston"
import { getRepository, Repository } from "typeorm"
import { encryptPassword, validatePassword } from "@utils/encryptPassword"
import { GlobalException } from "@exceptions"

import { Account } from "@models/account/account.entity"
import { AccountDTO } from "@models/account/account.dto"
import { AccountException } from "@exceptions"

export class AccountService {
	constructor(private readonly accountRepository: Repository<Account> = getRepository(Account)) {}

	public create = async (dto: AccountDTO.Request.Create.Body): Promise<Account> => {
		try {
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
			}

			throw new GlobalException.Unknown(null, "accountService.create", e)
		}
	}

	public find = async (findBy: { id?: string; identifier?: string }): Promise<Account> => {
		try {
			let account: Account | undefined = await this.accountRepository.findOne(findBy)

			if (account === undefined) {
				throw new AccountException.NotFound()
			}

			return account
		} catch (e) {
			console.log({ e })
			if (e instanceof AccountException.NotFound) {
				throw e
			}

			throw new GlobalException.Unknown(null, "accountService.find", e)
		}
	}

	public list = async (): Promise<Account[]> => {
		try {
			let accounts: Account[] = await this.accountRepository.find()

			return accounts
		} catch (e) {
			throw new GlobalException.Unknown(null, "accountService.list", e)
		}
	}

	public validatePassword = async (accountId: string, plainPassword: string): Promise<boolean> => {
		try {
			let account: Account = await this.accountRepository
				.createQueryBuilder("account")
				.addSelect("account.password")
				.where({ id: accountId })
				.getOne()

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
					return true
				} else {
					throw new AccountException.InvalidPassword()
				}
			} else {
				throw new AccountException.InvalidPassword()
			}
		} catch (e) {
			if (e instanceof AccountException.InvalidPassword) {
				throw e
			}

			throw new GlobalException.Unknown(null, "accountService.validatePassword", e)
		}
	}
}
