import { Args, CommandInstance } from "vorpal"
import { ACommand, ICommandLoad } from "../../interfaces/command.interface"
const clear = require("clear")

module.exports = class extends ACommand {
    public app!: ICommandLoad["app"]

    public load(props: ICommandLoad) {
        this.app = props.app
        
        props.cli
            .command("migrate:show")
            .alias("m:s")
            .description("Shows all migrations")
            .action(this.action)
    }

    public action = (args: Args, done: () => void): void => {
        this.app.getDatabaseConnection().showMigrations()
        .then((hasPending: boolean) => {
            if (hasPending) {
                console.log("The are pending migrations available")
            }
            else {
                console.log("The are no pending migrations")
            }

            done()
        })
    }
}
