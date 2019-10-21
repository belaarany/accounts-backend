import { Throwable } from "~src/app/helpers/Throwable"
import { ErrorReason, ErrorResponseError } from "@helpers/errorResponse"

export namespace AccountException {
	export class NotFound extends Throwable {
		constructor() {
			super()
		}

		public getErrorResponseError = (): ErrorResponseError => {
			return {
				source: "request",
				reason: ErrorReason.Account.ACCOUNT_NOT_EXISTS,
				message: "This account does not exist.",
			}
		}
	}

	export class Duplicated extends Throwable {
		constructor() {
			super()
		}

		public getErrorResponseError = (): ErrorResponseError => {
			return {
				source: "request",
				reason: ErrorReason.Account.ACCOUNT_ALREADY_EXISTS,
				message: "This identifier or email address is already taken.",
			}
		}
	}

	export class InvalidPassword extends Throwable {
		constructor() {
			super()
		}

		public getErrorResponseError = (): ErrorResponseError => {
			return {
				source: "request",
				reason: ErrorReason.Account.INVALID_PASSWORD,
				message: "The provided password is invalid for the provided account.",
			}
		}
	}
}
