import { Type } from "class-transformer"
import { IsDefined, IsUUID, IsEnum, IsNumber, ValidateIf, IsString } from "class-validator"
import { Step, EStep, Method, EMethod } from "@models/authSession/authSession.interface"

export class AuthenticationBodySchema {
    @IsDefined()
    @IsString()
    authSessionToken: string

    @IsDefined()
    @IsString()
    data: string
}

export class AuthenticationParamsSchema {
    @IsDefined()
    @IsEnum(EStep)
    step: Step

    @IsDefined()
    @IsEnum(EMethod)
    method: Method
}

export type AuthenticationResponseBody = {
    authenticated: boolean
    step?: string
    methods?: Array<Method>
    authSessionToken?: string
    accessToken?: string
    validUntil?: string
}
