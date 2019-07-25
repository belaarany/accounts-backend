import { Args, CommandInstance } from "vorpal"
import { ACommand, ICommandLoad } from "../interfaces/command.interface"
const clear = require("clear")

module.exports = class extends ACommand {
    protected app!: ICommandLoad["app"]

    public load(props: ICommandLoad) {
        props.app = props.app
        
        props.cli
            .command("clear")
            .alias("c")
            .alias("cc")
            .description("Clears the screen")
            .action(this.action)
    }

    public action(args: Args, done: () => void) {
        clear()

        done()
    }
}
