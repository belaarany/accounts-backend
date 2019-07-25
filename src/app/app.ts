import * as http from "http"
import * as dotenv from "dotenv"
import * as winston from "winston"
import * as bodyParser from "body-parser"
import express from "express"
import { IController } from "./interfaces/controller.interface"
import { httpDebugMiddleware } from "./middlewares/httpDebug.middleware"
import { createWinston, validateEnv } from "./utils"

import { CarsController } from "./controllers/cars.controller"

class App {
    private express!: express.Application

    constructor() {

    }

    public bootstrap(): Promise<App> {
        return new Promise((resolve: (app: App) => void, reject: () => void) => {
            // Pre-requirements
            this.registerWinstonLogger()

            winston.info("Application booting...")

            // Express
            this.express = express()

            // After-requirements
            this.registerEnvironmentVariables()
            this.registerMiddlewares()
            this.registerControllers([
                CarsController,
            ])

            winston.info("Application booted")

            resolve(this.getApp())
        })
    }

    public getApp(): App {
        return this
    }

    public getExpress(): express.Application {
        return this.express
    }

    private registerWinstonLogger(): void {
        createWinston()
    }

    private registerEnvironmentVariables(): void {
        dotenv.config()

        validateEnv()
    }

    private registerMiddlewares(): void {
        this.express.use(bodyParser.json())
        this.express.use(httpDebugMiddleware)
    }

    private registerControllers(controllers: Array<(new() => IController)>): void {
        controllers.forEach((_controller: (new() => IController)) => {
            let _class = new _controller()
            this.express.use(_class.path, _class.router)
        })
    }
}

export { App }
