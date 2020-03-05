import * as express from "express"
//import * as winston from "winston"
import { ErrorResponse } from "@helpers/errorResponse"

interface Controller {
    path: string,
    router: express.Router,

    registerRoutes(): void,
}

abstract class WebController {
    public errorResponse: ErrorResponse
    public router: express.Router = express.Router()

    constructor() {
        this.errorResponse = new ErrorResponse()        
    }

    public abstract registerRoutes(): void
}

export { Controller, WebController }
