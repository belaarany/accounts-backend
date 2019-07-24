import { Args, CommandInstance } from "vorpal"
import { ACommand, ICommandLoad } from "../interfaces/command.interface"
// @ts-ignore
const expressListEndpoints = require("express-list-endpoints")
const consoleTable = require("cli-table")

module.exports = class extends ACommand {
    public server!: ICommandLoad["server"]

    public load = (props: ICommandLoad) => {
        this.server = props.server

        props.cli
            .command("routes:list")
            .alias("r:l")
            .description("Lists all routes")
            .action(this.action)
    }

    public action = (args: Args, done: () => void) => {
        let server = this.server
        let express = server.getExpress()
        let routes = expressListEndpoints(express._router)

        var Table = require("cli-table")
 
        var table = new Table({
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
