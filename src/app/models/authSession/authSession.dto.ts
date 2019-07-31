import { Type } from "class-transformer"
import { IsDefined, IsUUID, IsEnum, IsNumber, ValidateIf, Length } from "class-validator"

export class AuthenticationBodySchema {
    @IsDefined()
    @IsNumber()
    @IsEnum([1, 201, 202, 301, 401])
    step: number

    @ValidateIf(o => o.step !== 1)
    @IsDefined()
    @Length(10, 500)
    authSessionToken: string

    @ValidateIf(o => o.step === 201 || o.step === 202)
    @IsDefined()
    @Length(3, 100)
    identifier: string

    @ValidateIf(o => o.step === 301)
    @IsDefined()
    @Length(3, 500)
    password: string
}
