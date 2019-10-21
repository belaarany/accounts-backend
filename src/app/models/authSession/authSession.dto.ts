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

				@IsOptional()
				@IsString()
				clientId: string
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

	export namespace Response {
		export namespace Init {
			export class Body {
				authenticated: false
				nextSteps: {
					step: Step
					url: string
				}[]
				authSessionToken: string
				validUntil: string
			}
		}

		export namespace Lookup {
			export class Body {
				authenticated: false
				nextSteps: {
					step: Step
					url: string
				}[]
				account: AccountPartial
			}
		}

		export namespace Challenge {
			export class Body {
				authenticated: true
				flowType: null | "authorization_code"
				code: string
			}
		}
	}
}

