import { Type } from "class-transformer"
import { IsDefined, IsUUID, IsEnum, IsNumber, ValidateIf, Length } from "class-validator"

export class AuthenticationBodySchema {
    @IsDefined()
    @IsNumber()
    @IsEnum([1, 201, 202, 301, 401])
    step: number

    @ValidateIf(o => o.step !== 1)
    @IsDefined()
    //@IsUUID("4")
    @Length(1, 50)
    authenticationSessionId: string

    @ValidateIf(o => o.step === 201 || o.step === 202)
    @IsDefined()
    @Length(3, 100)
    identifier: string
}
