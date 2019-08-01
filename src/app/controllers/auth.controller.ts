import * as express from "express"
import * as winston from "winston"
import * as tokenHandler from "@utils/tokenHandler"
import moment from "moment"
import { getRepository, Repository } from "typeorm"
import { IController, AController } from "~app/interfaces/controller.interface"
import { requestValidatorMiddleware } from "@middlewares/requestValidator.middleware"
import { AuthSession } from "@models/authSession/authSession.entity"
import { AuthenticationParamsSchema, AuthenticationBodySchema, AuthenticationResponseBody } from "@models/authSession/authSession.dto"
import { Account } from "@models/account/account.entity"
import { Step, Method } from "@models/authSession/authSession.interface"

export default class extends AController implements IController {
    public path: string = "/authentication"

    constructor(
        private readonly authSessionRepository: Repository<AuthSession> = getRepository(AuthSession),
        private readonly accountRepository: Repository<Account> = getRepository(Account),
    ) {
        super()
    }

    public registerRoutes = (): void => {
        this.router
        .post("/hello/init/", this.handleStatic)
        .post("/:step/:method", requestValidatorMiddleware({ params: AuthenticationParamsSchema, body: AuthenticationBodySchema }), this.handleDynamic)
    }

    public handleStatic = (request: express.Request, response: express.Response, next: express.NextFunction): void => {        
        this.initializeSession()
        .then((authSession: { authSessionId: string, valudUntil: Date }) => {
            this.getNext(authSession.authSessionId)
            .then((next: { step: Step, methods: Array<Method> }) => {
                let responseBody: AuthenticationResponseBody = {
                    authenticated: false,
                    authSessionToken: tokenHandler.encode(authSession.authSessionId),
                    validUntil: moment(authSession.valudUntil).format(),
                    step: next.step,
                    methods: next.methods,
                }

                response.json(responseBody)
            })
            .catch(() => {
                response.send("Failed")
            })
        })
        .catch(() => {
            response.send("Failed")
        })
    }

    public handleDynamic = (request: express.Request, response: express.Response, next: express.NextFunction): void => {
        let params: AuthenticationParamsSchema = request.params
        let body: AuthenticationBodySchema = request.body
        let authSessionId: string = tokenHandler.decode(body.authSessionToken).oid

        switch (params.method) {
            case "identifier": {
                this.lookupAccount("regular", body.data)
                .then((accountId: string) => {
                    return Promise.all<void, void>([
                        this.assignAccountToSession(accountId, authSessionId),
                        this.addCompleted(authSessionId, "lookup", "init"),
                    ])
                })
                .then(() => this.getNext(authSessionId))
                .then((next: { step: Step, methods: Array<Method> }) => {
                    let responseBody: AuthenticationResponseBody = {
                        authenticated: false,
                        step: next.step,
                        methods: next.methods,
                    }

                    response.json(responseBody)
                })
                .catch(() => {
                    this.errorResponse.send(response)
                })

                break
            }

            case "password": {
                this.getAccountIdBySession(authSessionId)
                .then((accountId: string) => {
                    this.validatePassword(accountId, body.data)
                    .then(() => {
                        Promise.all<void, void>([
                            this.addCompleted(authSessionId, "challenge", "password"),
                            this.markSessionAsDone(authSessionId),
                        ])
                        .then(() => {                        
                            let responseBody: AuthenticationResponseBody = {
                                authenticated: true,
                                accessToken: "soon_" + Date.now(),
                            }
        
                            response.json(responseBody)
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

    private getNext = (authSessionId: string): Promise<{ step: Step, methods: Array<Method> }> => {
        return new Promise((resolve: (next: { step: Step, methods: Array<Method> }) => void, reject: () => void) => {
            this.authSessionRepository.findOne({ id: authSessionId })
            .then((authSession: AuthSession) => {
                let stepsCompleted: Array<Step> = Object.values(authSession.stepsCompleted)
                let methodsCompleted: Array<Method> = Object.values(authSession.methodsCompleted)

                // If the length is 1 then only the initialization should have been done
                if (stepsCompleted.length === 1) {
                    if (stepsCompleted[0] === "hello") {
                        resolve({
                            step: "lookup",
                            methods: [
                                "identifier"
                            ],
                        })
                    }
                    else {
                        reject()
                    }
                }

                // Else checking which steps has been done
                else if (stepsCompleted.length > 1) {

                    // If 1 and 201 has been done
                    if (stepsCompleted.length === 2) {
                        if (stepsCompleted[0] === "hello" && stepsCompleted[1] === "lookup") {
                            resolve({
                                step: "challenge",
                                methods: [
                                    "password"
                                ],
                            })
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
                    [moment.utc().format()]: "hello",
                },
                methodsCompleted: {
                    [moment.utc().format()]: "init",
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
            switch (by) {
                case "regular": {
                    this.accountRepository.findOne({ identifier: identifier })
                    .then((account: Account) => {
                        resolve(account.id)
                    })

                    break
                }

               default: {
                    this.errorResponse.addError({
                        source: "server",
                        message: "Invalid Account lookup method has been requested.",
                    })

                    reject()
                }
            }
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

    private addCompleted = (authSessionId: string, step: Step, method: Method): Promise<void> => {
        return new Promise((resolve: () => void, reject: () => void) => {
            this.authSessionRepository.findOne({ id: authSessionId })
            .then((authSession: AuthSession) => {
                this.authSessionRepository.update({ id: authSessionId }, {
                    stepsCompleted: {
                        ...authSession.stepsCompleted,
                        [moment.utc().format()]: step,
                    },
                    methodsCompleted: {
                        ...authSession.methodsCompleted,
                        [moment.utc().format()]: method,
                    },
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
