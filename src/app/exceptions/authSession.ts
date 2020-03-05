import { Throwable } from "~src/app/helpers/Throwable"
import { ErrorReason, ErrorResponseError } from "@helpers/errorResponse"

export namespace AuthSessionException {
	export class InvalidFlowType extends Throwable {
		constructor() {
			super()
		}

		public getErrorResponseError = (): ErrorResponseError => {
			return {
				source: "request",
				reason: ErrorReason.Authorization.INVALID_FLOW_TYPE,
				message: "This flow-type is unsupported.",
			}
		}
	}

	export class SessionNotExists extends Throwable {
		constructor() {
			super()
		}

		public getErrorResponseError = (): ErrorResponseError => {
			return {
				source: "request",
				reason: ErrorReason.Authorization.SESSION_NOT_EXISTS,
				message: "No authentication session can be found using the give query.",
			}
		}
	}
}
