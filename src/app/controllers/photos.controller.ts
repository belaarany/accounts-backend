import * as express from "express"
import { getRepository, Repository } from "typeorm"
import { IController, AController } from "../interfaces/controller.interface"
import Photo from "../models/photo.entity"

export default class extends AController implements IController {
    public path: string = "/photos"
    public router: express.Router = express.Router()

    constructor(
        private readonly photoRepository: Repository<Photo> = getRepository(Photo)
    ) {
        super()
        
        this.registerRoutes()
    }

    private registerRoutes(): void {
        this.router
        .post("", this.createPost)
    }

    private createPost = (request: express.Request, response: express.Response, next: express.NextFunction): void => {
        console.log("best cars endpoint called")

        let photo = this.photoRepository.create({
            name: "Me and Bears",
            description: "I am near polar bears",
            filename: "photo-with-bears.jpg",
            views: 1,
            isPublished: true
        })

        this.photoRepository.save(photo)
        .then((result: any) => {
            console.log({result})
            response.send()
        })
    }
}
