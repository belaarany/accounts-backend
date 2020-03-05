import { Args, CommandInstance } from "vorpal"
import { ACommand, ICommandLoad } from "../interfaces/command.interface"
const clear = require("clear")

module.exports = class extends ACommand {
    public app!: ICommandLoad["app"]

    public load(props: ICommandLoad) {
        this.app = props.app
        
        props.cli
            .command("clear")
            .alias("c")
            .alias("cc")
            .description("Clears the screen")
            .action(this.action)
    }

    public action = (args: Args, done: () => void): void => {
        clear()

        done()
    }
}
