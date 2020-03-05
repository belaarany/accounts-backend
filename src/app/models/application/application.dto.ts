import { Type } from "class-transformer"
import { Length, IsDefined, IsUUID, IsUrl, IsHexadecimal } from "class-validator"

export namespace ApplicationDTO {
	export namespace Request {
		export namespace Create {
			export class Body {
				@IsDefined()
				@Length(3, 200)
				name: string

				@IsDefined()
				@IsUrl()
				homeUrl: string

				@IsDefined()
				@IsUrl()
				callbackUrl: string
			}
		}

		export namespace Get {
			export class Params {
				@IsDefined()
				@IsUUID("4")
				id: string
			}
		}

		export namespace GetPartial {
			export class Params {
				@IsDefined()
				@IsUUID("4")
				id: string
			}
		}

		export namespace ExchangeClientId {
			export class Params {
				@IsDefined()
				@IsHexadecimal()
				@Length(32, 32)
				clientId: string
			}
		}
	}
}
