import { Throwable } from "~src/app/helpers/Throwable"
import { ErrorReason, ErrorResponseError } from "@helpers/errorResponse"

export namespace GlobalException {
	export class Unknown extends Throwable {
		constructor(message: string | null, location: string, errorStack: any) {
			super()
		}
	}
}
