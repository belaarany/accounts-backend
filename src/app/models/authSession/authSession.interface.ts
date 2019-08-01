export type Step = "hello" | "lookup" | "challenge" | "verification"

export enum EStep {
    "hello",
    "lookup",
    "challenge",
    "verification",
}

export type Method = "init" | "identifier" | "password" | "one_time_password" | "backup_code"

export enum EMethod {
    "init",
    "identifier",
    "password",
    "one_time_password",
    "backup_code",
}
