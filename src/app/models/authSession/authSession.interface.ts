/*export type Step = "hello" | "lookup" | "challenge" | "verification"

export enum EStep {
    "hello",
    "lookup",
    "challenge",
    "verification",
}*/

export type Step = "INIT" | "IDENTIFIER" | "PASSWORD" | "ONE_TIME_PASSWORD" | "BACKUP_CODE"

export enum StepEnum {
	INIT = "INIT",
	IDENTIFIER = "IDENTIFIER",
	PASSWORD = "PASSWORD",
	ONE_TIME_PASSWORD = "ONE_TIME_PASSWORD",
	BACKUP_CODE = "BACKUP_CODE",
}
