import * as dotenv from "dotenv"
import * as winston from "winston"
import { App } from "./app"
import { validateEnv, createWinston } from "./utils"

import { CarsController } from "./controllers/cars.controller"

class Server {
    constructor() {
        this.registerWinstonLogger()
        
        winston.info("Server starting...")

        this.registerEnvironmentVariables()
        this.startApplication()
    }

    private registerWinstonLogger(): void {
        createWinston()
    }

    private registerEnvironmentVariables(): void {
        dotenv.config()

        validateEnv()
    }

    private startApplication(): void {
        new App({
            port: parseInt(process.env.APP_PORT || "8070"),
            controllers: [
                CarsController,
            ],
        })
    }
}

export { Server }
