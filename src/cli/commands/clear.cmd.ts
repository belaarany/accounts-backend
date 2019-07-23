import { Args, CommandInstance } from "vorpal"
import { AbstractCommand } from "./abstract"
const clear = require("clear")

module.exports = class extends AbstractCommand {
    public load(app: any) {
        app
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
