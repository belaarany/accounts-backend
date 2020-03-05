import * as express from "express"
import * as winston from "winston"
import { Controller, WebController } from "../interfaces/controller.interface"
import { requestValidatorMiddleware } from "@middlewares/requestValidator.middleware"
import { returnCollection } from "@utils/returnCollection"
import { ErrorReason } from "@helpers/errorResponse"

import { Application, ApplicationPartial } from "@models/application/application.entity"
import { ApplicationDTO } from "@models/application/application.dto"
import { ApplicationService } from "@models/application/application.service"
import { ApplicationException } from "@exceptions"

export default class extends WebController implements Controller {
	public path: string = "/applications"
	public router: express.Router = express.Router()

	constructor(private readonly applicationService: ApplicationService = new ApplicationService()) {
		super()
	}

	public registerRoutes = (): void => {
		this.router
			.post("", requestValidatorMiddleware({ body: ApplicationDTO.Request.Create.Body }), this.create)
			.get("/:id", requestValidatorMiddleware({ params: ApplicationDTO.Request.Get.Params }), this.get)
			.get("/:id/partial", requestValidatorMiddleware({ params: ApplicationDTO.Request.GetPartial.Params }), this.getPartial)
			.get("/exchangeClientId/:clientId", requestValidatorMiddleware({ params: ApplicationDTO.Request.ExchangeClientId.Params }), this.exchangeClientId)
	}

	public create = async (request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> => {
		let body: ApplicationDTO.Request.Create.Body = request.body

		try {
			let application: Application = await this.applicationService.create(body)

			response.json(application)
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
		let params: ApplicationDTO.Request.Get.Params = request.params as any

		try {
			let application: Application = await this.applicationService.find({ id: params.id })

			response.json(application)
		} catch (e) {
			if (e instanceof ApplicationException.NotFound) {
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

	public getPartial = async (request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> => {
		let params: ApplicationDTO.Request.Get.Params = request.params as any

		try {
			let application: Application = await this.applicationService.find({ id: params.id })
			let applicationPartial: ApplicationPartial = application.getPartial()

			response.json(applicationPartial)
		} catch (e) {
			if (e instanceof ApplicationException.NotFound) {
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

	public exchangeClientId = async (request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> => {
		let params: ApplicationDTO.Request.ExchangeClientId.Params = request.params as any

		try {
			let application: Application = await this.applicationService.find({ clientId: params.clientId })

			response.json({
				kind: "applications.application.id",
				id: application.id,
			})
		} catch (e) {
			if (e instanceof ApplicationException.NotFound) {
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
