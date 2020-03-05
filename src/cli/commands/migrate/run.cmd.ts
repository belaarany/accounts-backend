import { Args, CommandInstance } from "vorpal"
import { ACommand, ICommandLoad } from "../../interfaces/command.interface"
const clear = require("clear")

module.exports = class extends ACommand {
    public app!: ICommandLoad["app"]

    public load(props: ICommandLoad) {
        this.app = props.app
        
        props.cli
            .command("migrate:run")
            .alias("m:r")
            .description("Runs all migrations")
            .action(this.action)
    }

    public action = (args: Args, done: () => void): void => {
        this.app.getDatabaseConnection().runMigrations()
        .then((res: any) => {
            console.log({res})

            done()
        })
    }
}
