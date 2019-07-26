import { Router } from "express"
//import * as winston from "winston"

interface IController {
    path: string,
    router: Router,
}

abstract class AController {
    //public abstract registerRoutes(): void

    constructor() {
        
    }
}

export { IController, AController }
