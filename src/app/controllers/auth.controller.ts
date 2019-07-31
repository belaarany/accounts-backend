import * as express from "express"
import * as winston from "winston"
import * as tokenHandler from "../utils/tokenHandler"
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
        let authSessionId: string = tokenHandler.decode(body.authSessionToken).oid

        switch (body.step) {
            case 1: {
                this.initializeSession()
                .then((authSession: { authSessionId: string, valudUntil: Date }) => {
                    this.getNextSteps(authSession.authSessionId)
                    .then((nextSteps: Array<number>) => {
                        response.json({
                            authenticated: false,
                            authSessionToken: tokenHandler.encode(authSession.authSessionId),
                            valudUntil: authSession.valudUntil,
                            nextSteps: nextSteps,
                        })
                    })
                    .catch(() => {
                        response.send("Failed")
                    })
                })
                .catch(() => {
                    response.send("Failed")
                })

                break
            }

            case 201: {
                this.lookupAccount("regular", body.identifier)
                .then((accountId: string) => {
                    return Promise.all<void, void>([
                        this.assignAccountToSession(accountId, authSessionId),
                        this.addCompletedStep(authSessionId, 201),
                    ])
                })
                .then(() => this.getNextSteps(authSessionId))
                .then((nextSteps: Array<number>) => {
                    response.json({
                        authenticated: false,
                        nextSteps: nextSteps,
                    })
                })
                .catch(() => {
                    response.send("Failed")
                })

                break
            }

            case 301: {
                this.getAccountIdBySession(authSessionId)
                .then((accountId: string) => {
                    this.validatePassword(accountId, body.password)
                    .then(() => {
                        Promise.all<void, void>([
                            this.addCompletedStep(authSessionId, 301),
                            this.markSessionAsDone(authSessionId),
                        ])
                        .then(() => {
                            response.json({
                                authenticated: true,
                                accesToken: "soon_" + Date.now(),
                            })
                        })
                        .catch(() => {
                            response.send("Failed")
                        })
                    })
                    .catch(() => {
                        response.send("Failed")
                    })
                })

                break
            }

            default: {
                response.send("Unhandled step")
            }
        }
    }

    private getNextSteps = (authSessionId: string): Promise<Array<number>> => {
        return new Promise((resolve: (nextSteps: Array<number>) => void, reject: () => void) => {
            this.authSessionRepository.findOne({ id: authSessionId })
            .then((authSession: AuthSession) => {
                let stepsCompleted: Array<number> = Object.values(authSession.stepsCompleted)

                // If the length is 1 then only the initialization should have been done
                if (stepsCompleted.length === 1) {
                    if (stepsCompleted[0] === 1) {
                        resolve([ 201 ])
                    }
                    else {
                        reject()
                    }
                }

                // Else checking which steps has been done
                else if (stepsCompleted.length > 1) {

                    // If 1 and 201 has been done
                    if (stepsCompleted.length === 2) {
                        if (stepsCompleted[0] === 1 && stepsCompleted[1] === 201) {
                            resolve([ 301 ])
                        }
                        else {
                            reject()
                        }
                    }
                    else {
                        reject()
                    }
                }

                // If no steps has been done then it's a bug
                else {
                    reject()
                }
            })
        })
    }

    private initializeSession = (): Promise<{ authSessionId: string, valudUntil: Date }> => {
        return new Promise((resolve: (data: { authSessionId: string, valudUntil: Date }) => void, reject: () => void) => {
            let authSession: AuthSession = this.authSessionRepository.create({
                stepsCompleted: {
                    [moment.utc().format()]: 1,
                },
                validUntil: moment().add(1, "hours").format(),
                authenticatedAt: null,
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

    private getAccountIdBySession = (authSessionId: string): Promise<string> => {
        return new Promise((resolve: (accountId: string) => void, reject: () => void) => {
            this.authSessionRepository.findOne({ id: authSessionId })
            .then((authSession: AuthSession) => {
                resolve(authSession.accountId)
            })
        })
    }

    private assignAccountToSession = (accountId: string, authSessionId: string): Promise<void> => {
        return new Promise((resolve: () => void, reject: () => void) => {
            this.authSessionRepository.update({ id: authSessionId }, { accountId: accountId })
            .then(() => {
                resolve()
            })
        })
    }

    private addCompletedStep = (authSessionId: string, step: number): Promise<void> => {
        return new Promise((resolve: () => void, reject: () => void) => {
            this.authSessionRepository.findOne({ id: authSessionId })
            .then((authSession: AuthSession) => {
                this.authSessionRepository.update({ id: authSessionId }, {
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

    private validatePassword = (accountId: string, plainPassword: string): Promise<void> => {
        return new Promise((resolve: () => void, reject: () => void) => {
            this.accountRepository.findOneOrFail({ id: accountId, password: plainPassword })
            .then((account: Account) => {
                if (
                    account !== undefined &&
                    account !== null &&
                    Object.keys(account).length > 0 &&
                    account.hasOwnProperty("kind") === true
                ) {
                    resolve()
                }
                else {
                    reject()
                }
            })
            .catch(() => {
                reject()
            })
        })
    }

    private markSessionAsDone = (authSessionId: string): Promise<void> => {
        return new Promise((resolve: () => void, reject: () => void) => {
            this.authSessionRepository.update({ id: authSessionId }, { authenticatedAt: moment().format() })
            .then(() => {
                resolve()
            })
            .catch((err) => {
                console.log({err})
                reject()
            })
        })
    }
}
