import * as express from "express"
import * as winston from "winston"
import moment from "moment"
import { getRepository, Repository } from "typeorm"
import { IController, AController } from "../interfaces/controller.interface"
import { requestValidatorMiddleware } from "../middlewares/requestValidator.middleware"
import { AuthSession } from "../models/authSession/authSession.entity"
import { AuthenticationBodySchema } from "../models/authSession/authSession.dto"
import { Account } from "../models/account/account.entity"
import { returnCollection } from "../utils/returnCollection"

export default class extends AController implements IController {
    public path: string = "/authentication"
    public router: express.Router = express.Router()

    constructor(
        private readonly authSessionRepository: Repository<AuthSession> = getRepository(AuthSession),
        private readonly accountRepository: Repository<Account> = getRepository(Account),
    ) {
        super()
        
        this.registerRoutes()
    }

    private registerRoutes = (): void => {
        this.router
        .post("", requestValidatorMiddleware({ body: AuthenticationBodySchema }), this.handle)
    }

    public handle = (request: express.Request, response: express.Response, next: express.NextFunction): void => {
        let body: AuthenticationBodySchema = request.body

        switch (body.step) {
            case 1: {
                Promise.all<{ authSessionId: string, valudUntil: Date }, Array<number>>([
                    this.initializeSession(),
                    this.getNextSteps(1),
                ])
                .then(([{ authSessionId, valudUntil }, nextSteps]) => {
                    response.json({
                        authSessionId: authSessionId,
                        valudUntil: valudUntil,
                        nextSteps: [ 201 ],
                    })
                })                

                break
            }

            case 201: {
                this.lookupAccount("regular", body.identifier)
                .then((accountId: string) => {
                    return Promise.all<void, void>([
                        this.assignAccountToSession(accountId, body.authSessionId),
                        this.addCompletedStep(body.authSessionId, 201),
                    ])
                })
                .then(() => {
                    response.json({
                        nextSteps: [ 301 ],
                    })
                })

                break
            }

            default: {
                response.send("Unhandled step")
            }
        }
    }

    private getNextSteps = (currentStep: number): Promise<Array<number>> => {
        return new Promise((resolve: (nextSteps: Array<number>) => void, reject: () => void) => {
            resolve([201])
        })
    }

    private initializeSession = (): Promise<{ authSessionId: string, valudUntil: Date }> => {
        return new Promise((resolve: (data: { authSessionId: string, valudUntil: Date }) => void, reject: () => void) => {
            let authSession: AuthSession = this.authSessionRepository.create({
                stepsCompleted: {
                    [moment.utc().format()]: 1,
                },
                validUntil: moment().add(1, "hours").toDate(),
            })

            this.authSessionRepository.save(authSession)
            .then((result: AuthSession) => {
                resolve({
                    authSessionId: result.id,
                    valudUntil: result.validUntil,
                })
            })
        })
    }

    private lookupAccount = (by: "regular" | "one-time", identifier: string): Promise<string> => {
        return new Promise((resolve: (accountId: string) => void, reject: () => void) => {
            this.accountRepository.findOne({ identifier: identifier })
            .then((account: Account) => {
                resolve (account.id)
            })
        })
    }

    private assignAccountToSession = (accountId: string, sessionId: string): Promise<void> => {
        return new Promise((resolve: () => void, reject: () => void) => {
            this.authSessionRepository.update({ id: sessionId }, { accountId: accountId })
            .then(() => {
                resolve()
            })
        })
    }

    private addCompletedStep = (sessionId: string, step: number): Promise<void> => {
        return new Promise((resolve: () => void, reject: () => void) => {
            this.authSessionRepository.findOne({ id: sessionId })
            .then((authSession: AuthSession) => {
                this.authSessionRepository.update({ id: sessionId }, {
                    stepsCompleted: {
                        ...authSession.stepsCompleted,
                        [moment.utc().format()]: step,
                    }
                })
                .then(() => {
                    resolve()
                })
            })
        })
    }
}
