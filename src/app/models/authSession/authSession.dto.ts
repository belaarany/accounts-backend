import { Type } from "class-transformer"
import { IsDefined, IsUUID, IsEnum, IsNumber, ValidateIf, IsString, IsOptional, IsIn } from "class-validator"
import { Step, StepEnum } from "@models/authSession/authSession.interface"
import { AccountPartial } from "@models/account/account.entity"

export namespace AuthSessionDTO {
	export namespace Request {
		export namespace Init {
			export class Body {
				@IsDefined()
				@IsIn(["authorization_code"])
				flowType: "authorization_code"
			}
		}

		export namespace Lookup {
			export class Body {
				@IsDefined()
				@IsString()
				authSessionToken: string

				@IsDefined()
				@IsEnum(StepEnum)
				step: StepEnum.IDENTIFIER

				@IsDefined()
				@IsString()
				identifier: string
			}
		}

		export namespace Challenge {
			export class Body {
				@IsDefined()
				@IsString()
				authSessionToken: string

				@IsDefined()
				@IsEnum(StepEnum)
				step: StepEnum.PASSWORD | StepEnum.ONE_TIME_PASSWORD | StepEnum.BACKUP_CODE

				@ValidateIf(o => o.step === StepEnum.PASSWORD)
				@IsDefined()
				@IsString()
				password: string
			}
		}
	}
}

export namespace AuthBodySchema {
	export class Init {
		@IsDefined()
		@IsIn(["authorization_code"])
		flowType: "authorization_code"
	}

	export class Lookup {
		@IsDefined()
		@IsString()
		authSessionToken: string

		@IsDefined()
		@IsEnum(StepEnum)
		step: StepEnum.IDENTIFIER

		@IsDefined()
		@IsString()
		identifier: string
	}

	export class Challenge {
		@IsDefined()
		@IsString()
		authSessionToken: string

		@IsDefined()
		@IsEnum(StepEnum)
		step: StepEnum.PASSWORD | StepEnum.ONE_TIME_PASSWORD | StepEnum.BACKUP_CODE

		@ValidateIf(o => o.step === StepEnum.PASSWORD)
		@IsDefined()
		@IsString()
		password: string
	}
}

export class AuthParamsSchema {}

export type AuthResponseBody = {
	authenticated: boolean
	nextSteps?: {
		step: Step
		url: string
	}[]
	authSessionToken?: string
	validUntil?: string
	account?: AccountPartial

	flowType?: null | "authorization_code"
	code?: string
}
