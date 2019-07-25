import { App } from "../../app/app"

interface ICommandLoad {
    cli: any,
    app: App,
}

import { Args, CommandInstance } from "vorpal"

abstract class ACommand {
//    public abstract server: Server

    public abstract load(props: ICommandLoad): void

    public abstract action(/*this: CommandInstance, */args: Args, done: () => void): void
}

export { ICommandLoad, ACommand }
