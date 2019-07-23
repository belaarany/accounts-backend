import express from "express"
import * as winston from "winston"
import { IController } from "./interfaces/controller.interface"
import { httpDebugMiddleware } from "./middlewares/httpDebug.middleware"

interface IApp {
    controllers: Array<{new(): IController}>,
    port: number,
}

class App {
    public app: express.Application

    constructor(props: IApp) {
        winston.info("Application starting...")

        this.app = express()

        this.registerMiddlewares()
        this.registerControllers(props.controllers)

        this.listen(props.port)
    }

    private listen(port: number) {
        this.app.listen(port, () => {
            winston.info(`Application started listening on port ${port}`)
        })
    }

    private registerMiddlewares(): void {
        this.app.use(httpDebugMiddleware)
    }

    private registerControllers(controllers: IApp["controllers"]): void {
        controllers.forEach((_controller: IApp["controllers"][number]) => {
            let _class = new _controller()
            this.app.use(_class.path, _class.router)
        })

        
        /*let _router = express.Router()
        console.log(this.app._router.stack)
        console.log(this.app._router.stack[2].handle.stack)*/
    }
}

export { App, IApp }
