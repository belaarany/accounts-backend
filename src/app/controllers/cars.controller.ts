import * as express from "express"
import { getRepository, Repository } from "typeorm"
import { IController, AController } from "../interfaces/controller.interface"

export default class extends AController implements IController {
    public path: string = "/cars"
    public router: express.Router = express.Router()

    constructor(
        
    ) {
        super()
        
        this.registerRoutes()
    }

    private registerRoutes(): void {
        this.router
        .get("", () => {})
    }
}
