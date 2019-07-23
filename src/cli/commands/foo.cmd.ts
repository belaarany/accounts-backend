import { Args, CommandInstance } from "vorpal"
import { AbstractCommand } from "./abstract"

module.exports = class extends AbstractCommand {
    public load(app: any) {
        app
        .command("get:account <uuid>")
        .option("-v, --verbose", "Print foobar instead.")
        .description("Returns a Account Entity.")
        .action(this.action)
    }

    public action(args: Args, done: () => void) {
        console.log("command called, argS:", args)

        done()
    }
}
