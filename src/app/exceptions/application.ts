import { Throwable } from "~src/app/helpers/Throwable"
import { ErrorReason, ErrorResponseError } from "@helpers/errorResponse"

export namespace ApplicationException {
	export class NotFound extends Throwable {
		constructor() {
			super()
		}

		public getErrorResponseError = (): ErrorResponseError => {
			return {
				source: "request",
				reason: ErrorReason.Application.NOT_EXISTS,
				message: "This application does not exist.",
			}
		}
	}
}
