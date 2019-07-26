import * as express from "express"
import * as winston from "winston"
import { getRepository, Repository } from "typeorm"
import { Type } from "class-transformer"
import { Length, MaxLength, ValidateNested, IsDefined } from "class-validator"
import { IController, AController } from "../interfaces/controller.interface"
import { requestValidatorMiddleware } from "../middlewares/requestValidator.middleware"
import AccountEntity from "../models/account/account.entity"

class FFegkjhewkgjwe {
    @IsDefined()
    @Length(10, 20)
    sub: string
}

export class Gnrbigui {
    @IsDefined()
    @Length(10, 20)
    word: string

    /*@MaxLength(20, {
        each: true
    })
    nested: Map<string, string>*/

    @IsDefined()
    @ValidateNested()
    @Type(() => FFegkjhewkgjwe)
    nested: FFegkjhewkgjwe
}

export default class extends AController implements IController {
    public path: string = "/accounts"
    public router: express.Router = express.Router()

    constructor(
        private readonly accountRepository: Repository<AccountEntity> = getRepository(AccountEntity)
    ) {
        super()
        
        this.registerRoutes()
    }

    private registerRoutes(): void {
        this.router
        .post("", requestValidatorMiddleware(Gnrbigui), this.createAccount)
    }

    private createAccount = (request: express.Request, response: express.Response, next: express.NextFunction): void => {
        /*let account = this.accountRepository.create({
            identifier: "belaarany",
            password: "jkwbgjk34bkg",
            profile_name: "Bela Arany",
        })

        this.accountRepository.save(account)
        .then((result: AccountEntity) => {
            winston.debug(`Account created --> ${JSON.stringify(result)}`)

            console.log({result})

            response.send()
        })*/

        response.send()
    }
}
