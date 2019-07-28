import * as express from "express"
import * as winston from "winston"
import { getRepository, Repository } from "typeorm"
import { IController, AController } from "../interfaces/controller.interface"
import { requestValidatorMiddleware } from "../middlewares/requestValidator.middleware"
import { AuthenticationSession } from "../models/authenticationSession/authenticationSession.entity"
import { AuthenticationBodySchema } from "../models/authenticationSession/authenticationSession.dto"
import { returnCollection } from "../utils/returnCollection"

export default class extends AController implements IController {
    public path: string = "/authentication"
    public router: express.Router = express.Router()

    constructor(
        private readonly accountRepository: Repository<AuthenticationSession> = getRepository(AuthenticationSession)
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
                Promise.all<string, Array<number>>([
                    this.initializeSession(),
                    this.getNextSteps(1),
                ])
                .then(([authenticationSessionId, nextSteps]) => {
                    response.json({
                        authenticationSessionId: authenticationSessionId,
                        nextSteps: nextSteps,
                    })
                })                

                break
            }

            default: {
                response.send("Unhandled step")
            }
        }
    }

    private initializeSession = (): Promise<string> => {
        return new Promise((resolve: (authenticationSessionId: string) => void, reject: () => void) => {
            resolve("authSessId__" + Date.now())
        })
    }

    private getNextSteps = (currentStep: number): Promise<Array<number>> => {
        return new Promise((resolve: (nextSteps: Array<number>) => void, reject: () => void) => {
            resolve([201])
        })
    }
}
