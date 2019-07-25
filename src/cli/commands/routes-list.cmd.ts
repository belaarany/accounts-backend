import { Args, CommandInstance } from "vorpal"
import { ACommand, ICommandLoad } from "../interfaces/command.interface"
// @ts-ignore
const expressListEndpoints = require("express-list-endpoints")
const consoleTable = require("cli-table")

module.exports = class extends ACommand {
    public app!: ICommandLoad["app"]

    public load = (props: ICommandLoad) => {
        this.app = props.app

        props.cli
            .command("routes:list")
            .alias("r:l")
            .description("Lists all routes")
            .action(this.action)
    }

    public action = (args: Args, done: () => void) => {
        let app = this.app
        let express = app.getExpress()
        let routes = expressListEndpoints(express._router)
 
        var table = new consoleTable({
            head: ["Methods", "Path"]
        });

        routes.forEach((route: any) => {
            table.push([
                route.methods,
                route.path,
            ])
        })
        
        console.log(table.toString());

        //console.log({routes})

        done()
    }
}
