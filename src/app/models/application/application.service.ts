import * as winston from "winston"
import { getRepository, Repository } from "typeorm"
import cryptoRandomString from "crypto-random-string"

import { Application, ApplicationPartial } from "@models/application/application.entity"
import { ApplicationDTO } from "@models/application/application.dto"
import { ApplicationException } from "@exceptions"

export class ApplicationService {
	constructor(private readonly applicationRepository: Repository<Application> = getRepository(Application)) {}

	public create = async (dto: ApplicationDTO.Request.Create.Body): Promise<Application> => {
		try {
			let preparedApplication: Application = this.applicationRepository.create({
				name: dto.name,
				homeUrl: dto.homeUrl,
				callbackUrl: dto.callbackUrl,

				clientSecret: cryptoRandomString({ length: 64 }),
			})

			let result: Application = await this.applicationRepository.save(preparedApplication)
			let application: Application | undefined = await this.applicationRepository.findOne({ id: result.id })

			if (application === undefined) {
				throw new Error("Application couldn't be found after creating it")
			}

			winston.debug(`Application created --> ${JSON.stringify(application)}`)

			return application
		} catch (e) {
			throw new Error("Unknown error")
		}
	}

	public find = async (findBy: { id?: string; clientId?: string }): Promise<Application> => {
		try {
			if (Object.keys(findBy).length === 0) {
				throw new SyntaxError("This method requires at least 1 object property to be passed")
			}

			let application: Application | undefined = await this.applicationRepository.findOne(findBy)

			if (application === undefined) {
				throw new ApplicationException.NotFound()
			}

			return application
		} catch (e) {
			if (e instanceof ApplicationException.NotFound) {
				throw e
			} else {
				throw new Error("Unknown error")
			}
		}
	}
}
