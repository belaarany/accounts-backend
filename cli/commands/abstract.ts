import { Args, CommandInstance } from "vorpal"

export abstract class AbstractCommand {
    public abstract load(app: any): void

    public abstract action(this: CommandInstance, args: Args, done: () => void): void
}
