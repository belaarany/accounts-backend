import * as express from "express"
import * as winston from "winston"
import { getRepository, Repository } from "typeorm"
import { IController, AController } from "../interfaces/controller.interface"
import { requestValidatorMiddleware } from "../middlewares/requestValidator.middleware"
import { Account } from "../models/account/account.entity"
import { GetParamsSchema, CreateBodySchema } from "../models/account/account.dto"
import { returnCollection } from "../utils/returnCollection"

export default class extends AController implements IController {
    public path: string = "/accounts"
    public router: express.Router = express.Router()

    constructor(
        private readonly accountRepository: Repository<Account> = getRepository(Account),
    ) {
        super()
        
        this.registerRoutes()
    }

    private registerRoutes = (): void => {
        this.router
        .get("", this.list)
        .get("/:id", requestValidatorMiddleware({ params: GetParamsSchema }), this.get)
        .post("", requestValidatorMiddleware({ body: CreateBodySchema }), this.create)
    }

    public create = (request: express.Request, response: express.Response, next: express.NextFunction): void => {
        let body: CreateBodySchema = request.body

        let account: Account = this.accountRepository.create({
            identifier: body.identifier,
            password: body.password,
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.lastName,
        })

        this.accountRepository.save(account)
        .then((result: Account) => {
            winston.debug(`Account created --> ${JSON.stringify(result)}`)

            response.json(result)
        })
    }

    public list = (request: express.Request, response: express.Response, next: express.NextFunction): void => {
        this.accountRepository.find()
        .then((accounts: Array<Account>) => {
            response.json(returnCollection("accounts.accountList", accounts))
        })
    }

    public get = (request: express.Request, response: express.Response, next: express.NextFunction): void => {
        let params: GetParamsSchema = request.params.id

        this.accountRepository.findOne({ id: params.id })
        .then((account: Account) => {
            response.json(account)
        })
    }
}
