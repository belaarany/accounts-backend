import * as express from "express"
import * as winston from "winston"
import { getRepository, Repository } from "typeorm"
import { Controller, WebController } from "../interfaces/controller.interface"
import { requestValidatorMiddleware } from "@middlewares/requestValidator.middleware"
import { returnCollection } from "@utils/returnCollection"
import cryptoRandomString from "crypto-random-string"

import { Application, ApplicationPartial } from "@models/application/application.entity"
import { Request as RequestSchema } from "@models/application/application.dto"

export default class extends WebController implements Controller {
	public path: string = "/applications"
	public router: express.Router = express.Router()

	constructor(private readonly applicationRepository: Repository<Application> = getRepository(Application)) {
		super()
	}

	public registerRoutes = (): void => {
		this.router
			.get(
				"/exchangeClientId/:clientId",
				requestValidatorMiddleware({ params: RequestSchema.ExchangeClientId.Params }),
				this.exchangeClientId,
			)
			.get(
				"/:id/partial",
				requestValidatorMiddleware({ params: RequestSchema.GetPartial.Params }),
				this.getPartial,
			)
			.post("", requestValidatorMiddleware({ body: RequestSchema.Create.Body }), this.create)
	}

	public create = (request: express.Request, response: express.Response, next: express.NextFunction): void => {
		let body: RequestSchema.Create.Body = request.body

		let application: Application = this.applicationRepository.create({
			name: body.name,
			homeUrl: body.homeUrl,
			callbackUrl: body.callbackUrl,

			clientSecret: cryptoRandomString({ length: 64 }),
		})

		this.applicationRepository.save(application).then((result: Application) => {
			this.applicationRepository.findOneOrFail({ id: result.id }).then((application: Application) => {
				winston.debug(`Application created --> ${JSON.stringify(application)}`)

				response.json(application)
			})
		})
	}

	public exchangeClientId = (
		request: express.Request,
		response: express.Response,
		next: express.NextFunction,
	): void => {
		let params: RequestSchema.ExchangeClientId.Params = request.params

		this.applicationRepository.findOneOrFail({ clientId: params.clientId }).then((application: Application) => {
			response.json({
				kind: "applications.application.id",
				id: application.id,
			})
		})
	}

	public getPartial = (request: express.Request, response: express.Response, next: express.NextFunction): void => {
		let params: RequestSchema.GetPartial.Params = request.params

		this.applicationRepository.findOneOrFail({ id: params.id }).then((application: Application) => {
			let applicationPartial: ApplicationPartial = application.getPartial()

			response.json(applicationPartial)
		})
	}

	/*public list = (request: express.Request, response: express.Response, next: express.NextFunction): void => {
        this.accountRepository.find()
        .then((accounts: Array<Account>) => {
            response.json(returnCollection("accounts.accountList", accounts))
        })
    }

    public get = (request: express.Request, response: express.Response, next: express.NextFunction): void => {
        let params: GetParamsSchema = request.params

        this.accountRepository.findOneOrFail({ id: params.id })
        .then((account: Account) => {
            response.json(account)
        })
    }*/
}
