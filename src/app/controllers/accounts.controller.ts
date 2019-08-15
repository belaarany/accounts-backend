import * as express from "express"
import * as winston from "winston"
import { getRepository, Repository } from "typeorm"
import { Controller, WebController } from "../interfaces/controller.interface"
import { requestValidatorMiddleware } from "@middlewares/requestValidator.middleware"
import { Account } from "@models/account/account.entity"
import { GetParamsSchema, CreateBodySchema } from "@models/account/account.dto"
import { returnCollection } from "@utils/returnCollection"
import { encryptPassword } from "@utils/encryptPassword"

export default class extends WebController implements Controller {
    public path: string = "/accounts"
    public router: express.Router = express.Router()

    constructor(
        private readonly accountRepository: Repository<Account> = getRepository(Account),
    ) {
        super()
    }

    public registerRoutes = (): void => {
        this.router
        .get("", this.list)
        .get("/:id", requestValidatorMiddleware({ params: GetParamsSchema }), this.get)
        .post("", requestValidatorMiddleware({ body: CreateBodySchema }), this.create)
    }

    public create = (request: express.Request, response: express.Response, next: express.NextFunction): void => {
        let body: CreateBodySchema = request.body

        let account: Account = this.accountRepository.create({
            identifier: body.identifier,
            password: encryptPassword(body.password),
            passwordEncryption: "bcrypt",
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
        })

        this.accountRepository.save(account)
        .then((result: Account) => {
            // ---
            // Do not return the result directly because it contains the password!
            // ---

            this.accountRepository.findOneOrFail({ id: result.id })
            .then((account: Account) => {
                winston.debug(`Account created --> ${JSON.stringify(account)}`)
    
                response.json(account)
            })
        })
    }

    public list = (request: express.Request, response: express.Response, next: express.NextFunction): void => {
        this.accountRepository.find()
        .then((accounts: Array<Account>) => {
            response.json(returnCollection("accounts.accountList", accounts))
        })
    }

    public get = (request: express.Request, response: express.Response, next: express.NextFunction): void => {
        let params: GetParamsSchema = request.params

        this.accountRepository.findOneOrFail({ id: params.id })
        .then((account: Account) => {
            response.json(account)
        })
    }
}
