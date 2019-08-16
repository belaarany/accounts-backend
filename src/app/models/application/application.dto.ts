import { Type } from "class-transformer"
import { Length, IsDefined, IsUUID, IsUrl } from "class-validator"

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

	export namespace GetPartial {
		export class Params {
			@IsDefined()
			@IsUUID("4")
			id: string
		}
	}
}
