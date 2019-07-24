import * as http from "http"
import * as winston from "winston"
import * as bodyParser from "body-parser"
import express from "express"
import { IController } from "./interfaces/controller.interface"
import { httpDebugMiddleware } from "./middlewares/httpDebug.middleware"

interface IApp {
    controllers: Array<new() => IController>,
    port: number,
}

class App {
    private app!: express.Application
    private server!: http.Server
    private constructorProps!: IApp

    constructor(props: IApp) {
        winston.info("Application starting...")

        this.constructorProps = props
    }

    public start(): Promise<void> {
        return new Promise((resolve: () => void, reject: () => void) => {       
            let props = this.constructorProps

            this.app = express()

            this.registerMiddlewares()
            this.registerControllers(props.controllers)

            this.listen(props.port)
            .then(resolve)
        })
    }

    public shutdown(): void {
        this.server.close()
    }

    public getApp(): App {
        return this
    }

    public getServer(): http.Server {
        return this.server
    }

    public getExpress(): express.Application {
        return this.app
    }

    private listen(port: number): Promise<void> {
        return new Promise((resolve: () => void, reject: () => void) => {   
            this.server = this.app.listen(port, () => {
                winston.info(`Application started listening on port ${port}`)

                resolve()
            })
        })
    }

    private registerMiddlewares(): void {
        this.app.use(bodyParser.json())
        this.app.use(httpDebugMiddleware)
    }

    private registerControllers(controllers: IApp["controllers"]): void {
        controllers.forEach((_controller: IApp["controllers"][number]) => {
            let _class = new _controller()
            this.app.use(_class.path, _class.router)
        })
    }
}

export { App, IApp }
