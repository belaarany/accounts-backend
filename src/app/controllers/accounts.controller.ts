import * as express from "express"
import * as winston from "winston"
import { Controller, WebController } from "../interfaces/controller.interface"
import { requestValidatorMiddleware } from "@middlewares/requestValidator.middleware"
import { returnCollection } from "@utils/returnCollection"
import { ErrorReason } from "@helpers/errorResponse"

import { Account } from "@models/account/account.entity"
import { AccountDTO } from "@models/account/account.dto"
import { AccountService } from "@models/account/account.service"
import { AccountException } from "@exceptions"

export default class extends WebController implements Controller {
	public path: string = "/accounts"
	public router: express.Router = express.Router()

	constructor(private readonly accountService: AccountService = new AccountService()) {
		super()
	}

	public registerRoutes = (): void => {
		this.router
			.get("", this.list)
			.get("/:id", requestValidatorMiddleware({ params: AccountDTO.Request.Get.Params }), this.get)
			.post("", requestValidatorMiddleware({ body: AccountDTO.Request.Create.Body }), this.create)
	}

	public create = async (request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> => {
		let body: AccountDTO.Request.Create.Body = request.body

		try {
			let account: Account = await this.accountService.create(body)

			response.json(account)
		} catch (e) {
			if (e instanceof AccountException.Duplicated) {
				this.errorResponse.addError(e.getErrorResponseError()).send(response)
			} else {
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

	public list = async (request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> => {
		try {
			let accounts: Account[] = await this.accountService.list()

			response.json(returnCollection("accounts.accountList", accounts))
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

	public get = async (request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> => {
		let params: AccountDTO.Request.Get.Params = request.params

		try {
			let account: Account = await this.accountService.find({ id: params.id })

			response.json(account)
		} catch (e) {
			if (e instanceof AccountException.NotFound) {
				this.errorResponse.addError(e.getErrorResponseError()).send(response)
			} else {
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
}
