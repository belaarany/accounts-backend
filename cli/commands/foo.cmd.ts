import { Args, CommandInstance } from "vorpal"
import { AbstractCommand } from "./abstract"

class FooCommand extends AbstractCommand {
    public load(app: any) {
        app
        .command('foo <requiredArg> [optionalArg]')
        .option('-v, --verbose', 'Print foobar instead.')
        .description('Outputs "bar".')
        .action(this.action)
    }

    public action(args: Args, callback: any) {
        console.log("command called, argS:", args)

        callback()
    }
}

module.exports = FooCommand
