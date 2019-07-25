import { Router } from "express"
import * as winston from "winston"

interface IController {
    path: string,
    router: Router,
}

abstract class AController {
    //public abstract registerRoutes(): void

    constructor() {
        winston.info(`Controller "${this.constructor.name}" imported`)
    }
}

export { IController, AController }
