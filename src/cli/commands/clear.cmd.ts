import { Args, CommandInstance } from "vorpal"
import { ACommand, ICommandLoad } from "../interfaces/command.interface"
const clear = require("clear")

module.exports = class extends ACommand {
    protected server!: ICommandLoad["server"]

    public load(props: ICommandLoad) {
        props.server = props.server
        
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
