import * as express from "express"
//import * as winston from "winston"
import { ErrorResponse } from "@helpers/errorResponse"

interface IController {
    path: string,
    router: express.Router,

    registerRoutes(): void,
}

abstract class AController {
    public errorResponse: ErrorResponse
    public router: express.Router = express.Router()

    constructor() {
        this.errorResponse = new ErrorResponse()        
    }

    public abstract registerRoutes(): void
}

export { IController, AController }
