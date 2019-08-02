import { Type } from "class-transformer"
import { IsDefined, IsUUID, IsEnum, IsNumber, ValidateIf, IsString, IsOptional, IsIn } from "class-validator"
import { Step, EStep, Method, EMethod } from "@models/authSession/authSession.interface"
import { AccountPartial } from "@models/account/account.entity"

export class AuthStaticBodySchema {
    @IsDefined()
    @IsIn(["authorization_code"])
    flowType: "authorization_code"
}

export class AuthDynamicBodySchema {
    @IsDefined()
    @IsString()
    authSessionToken: string

    @IsDefined()
    @IsString()
    data: string
}

export class AuthParamsSchema {
    @IsDefined()
    @IsEnum(EStep)
    step: Step

    @IsDefined()
    @IsEnum(EMethod)
    method: Method
}

export type AuthResponseBody = {
    authenticated: boolean
    step?: string
    methods?: Array<Method>
    authSessionToken?: string
    validUntil?: string
    account?: AccountPartial,
    
    flowType?: null | "authorization_code"
    code?: string
}
