import clear from "clear"
import * as tokenHandler from "~app/utils/tokenHandler"
import treeify from "treeify"
import { Args, CommandInstance } from "vorpal"
import { ACommand, ICommandLoad } from "../interfaces/command.interface"

module.exports = class extends ACommand {
	public app!: ICommandLoad["app"]

	public load(props: ICommandLoad) {
		this.app = props.app

		props.cli
			.command("token:decode <token>")
			.description("Decodes a token")
			.action(this.decodeToken)
	}

	public action

	public decodeToken = (args: Args, done: () => void): void => {
		const decoded = tokenHandler.decode(args.token)

		console.log("token")
		console.log(treeify.asTree(decoded, true))

		done()
	}
}
