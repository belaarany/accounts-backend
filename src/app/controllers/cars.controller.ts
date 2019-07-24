import * as express from "express"
import { IController, AController } from "../interfaces/controller.interface"

class CarsController extends AController implements IController {
    public path: string = "/cars"
    public router: express.Router = express.Router()

    constructor() {
        super()
        
        this.registerRoutes()
    }

    private registerRoutes(): void {
        this.router
        .get("/bests", (req, res) => {
            console.log("best cars endpoint called")

            res.send("okay")
        })
        .get("/folks", (req, res) => {
            console.log("best cars endpoint called")

            res.send("okay")
        })
        .post("/folks", (req, res) => {
            console.log("best cars endpoint called")

            res.send("okay")
        })
    }
}

export { CarsController }
