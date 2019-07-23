import { Args, CommandInstance } from "vorpal"
import { AbstractCommand } from "./abstract"

module.exports = class extends AbstractCommand {
    public load(app: any) {
        app
        .command("create:account")
        .alias("c:a")
        .action(this.action)
    }

    public action(args: Args, done: () => void) {
        // @ts-ignore
        this.prompt([
            {
                type: "input",
                name: "time",
                message: "wassup",
            },
            {
                type: "confirm",
                name: "idk",
                message: "and now?",
            },
        ], (data: any) => {
            console.log({data})

            done()
        })
    }
}
