import * as express from "express"
import * as winston from "winston"
import * as tokenHandler from "@utils/tokenHandler"
import moment from "moment"
import { getRepository, Repository } from "typeorm"
import { Controller, WebController } from "~app/interfaces/controller.interface"
import { requestValidatorMiddleware } from "@middlewares/requestValidator.middleware"
import { AuthSession } from "@models/authSession/authSession.entity"
import { AuthParamsSchema, AuthStaticBodySchema, AuthDynamicBodySchema, AuthResponseBody } from "@models/authSession/authSession.dto"
import { Account } from "@models/account/account.entity"
import { Step, Method } from "@models/authSession/authSession.interface"
import { ErrorResponseError } from "@helpers/errorResponse"

export default class extends WebController implements Controller {
    public path: string = "/authentication"

    constructor(
        private readonly authSessionRepository: Repository<AuthSession> = getRepository(AuthSession),
        private readonly accountRepository: Repository<Account> = getRepository(Account),
    ) {
        super()
    }

    public registerRoutes = (): void => {
        this.router
        .post("/hello/init/", requestValidatorMiddleware({ body: AuthStaticBodySchema }), this.handleStatic)
        .post("/:step/:method", requestValidatorMiddleware({ params: AuthParamsSchema, body: AuthDynamicBodySchema }), this.handleDynamic)
    }

    public handleStatic = async (request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> => {
        let body: AuthStaticBodySchema = request.body

        try {
            let authSession: { authSessionId: string, valudUntil: Date } = await this.initializeSession({ flowType: body.flowType || null })
            let nexts: { step: Step, methods: Array<Method> } = await this.getNexts(authSession.authSessionId)
            
            let responseBody: AuthResponseBody = {
                authenticated: false,
                authSessionToken: tokenHandler.encode(authSession.authSessionId),
                validUntil: moment(authSession.valudUntil).format(),
                step: nexts.step,
                methods: nexts.methods,
            }

            response.json(responseBody)
        }
        catch (e) {
            this.errorResponse.addError(e).send(response)
        }
    }

    public handleDynamic = async (request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> => {
        let params: AuthParamsSchema = request.params
        let body: AuthDynamicBodySchema = request.body
        let authSessionId: string = tokenHandler.decode(body.authSessionToken).oid

        switch (params.method) {
            case "identifier": {
                try {
                    let account: Account = await this.lookupAccount("regular", body.data)
                    await this.assignAccountToSession(account.id, authSessionId)
                    await this.addCompleted(authSessionId, "lookup", "init")
                    let nexts: { step: Step, methods: Array<Method> } = await this.getNexts(authSessionId)

                    let responseBody: AuthResponseBody = {
                        authenticated: false,
                        step: nexts.step,
                        methods: nexts.methods,
                        account: account.getPartial(),
                    }

                    response.json(responseBody)
                }
                catch (e) {
                    this.errorResponse.addError(e).send(response)
                }

                break
            }

            case "password": {
                try {
                    let accountId: string = await this.getAccountIdBySession(authSessionId)
                    await this.validatePassword(accountId, body.data)
                    await this.addCompleted(authSessionId, "challenge", "password"),
                    await this.markSessionAsDone(authSessionId)

                    let responseBody: AuthResponseBody = {
                        authenticated: true,
                        flowType: "authorization_code",
                        code: "soon_" + Date.now(),
                    }

                    response.json(responseBody)
                }
                catch (e) {
                    this.errorResponse.addError(e).send(response)
                }

                break
            }

            default: {                
                this.errorResponse.addError({
                    source: "request",
                    location: "parameter",
                    property: "method",
                    message: "Unknown parameter 'method' property has been passed.",
                })
                .send()
            }
        }
    }

    private getNexts = (authSessionId: string): Promise<{ step: Step, methods: Array<Method> }> => {
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

    private initializeSession = (data: { flowType: AuthStaticBodySchema["flowType"] }): Promise<{ authSessionId: string, valudUntil: Date }> => {
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
                flowType: data.flowType,
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

    private lookupAccount = (by: "regular" | "one-time", identifier: string): Promise<Account> => {
        return new Promise((resolve: (account: Account) => void, reject: () => void) => {
            switch (by) {
                case "regular": {
                    this.accountRepository.findOne({ identifier: identifier })
                    .then((account: Account) => {
                        resolve(account)
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
        return new Promise((resolve: () => void, reject: (error: ErrorResponseError) => void) => {
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
                    throw Error()
                }
            })
            .catch(() => {
                reject({
                    source: "request",
                    message: "Invalid password",
                    reason: "invalidPassword",
                })
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
