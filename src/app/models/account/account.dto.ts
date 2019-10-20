import { Type } from "class-transformer"
import { Length, MaxLength, ValidateNested, IsDefined, IsEmail, IsUUID } from "class-validator"

export namespace AccountDTO {
	export namespace Request {
		export namespace Create {
			export class Body {
				@IsDefined()
				@Length(5, 20)
				identifier: string

				@IsDefined()
				@Length(5, 500)
				password: string

				@IsDefined()
				@IsEmail()
				email: string

				@IsDefined()
				@Length(3, 30)
				firstName: string

				@IsDefined()
				@Length(3, 30)
				lastName: string
			}
		}

		export namespace Get {
			export class Params {
				@IsDefined()
				@IsUUID("4")
				id: string
			}
		}
	}
}
