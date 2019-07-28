import { Type } from "class-transformer"
import { Length, MaxLength, ValidateNested, IsDefined, IsEmail, IsUUID } from "class-validator"

export class CreateBodySchema {
    @IsDefined()
    @Length(5, 20)
    identifier: string

    @IsDefined()
    @Length(5, 500)
    password: string

    @IsDefined()
    @IsEmail()
    email: string

    @IsDefined()
    @Length(3, 30)
    firstName: string

    @IsDefined()
    @Length(3, 30)
    lastName: string
}

export class GetParamsSchema {
    @IsDefined()
    @IsUUID("4")
    id: string
}