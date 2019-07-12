type IKWArgs__HelloWorld = {
	username?: string
}

class Command__HelloWorld {
	/**
	 * Command
	 */
	public command: string = "helloworld"

	/**
	 * Shorthand
	 */
	public shorthand: string = "hw"

	/**
	 * Command description
	 */
	public description: string = "This s a command for testing."

	/**
	 * Command argument
	 */
	public argument: string | null = "accountId"

	/**
	 * Keyword arguments and it's descriptions
	 */
	public keywordArguments: IKWArgs__HelloWorld = {
		username: "The username of the account.",
	}

	/**
	 * Constructor
	 */
	constructor() {}

	/**
	 * Code-block that the command will execute
	 *
	 * @param args Array<string>
	 * @param kwargs IKWArgs
	 * @returns void
	 */
	public handle(arg: string | null, kwargs: IKWArgs__HelloWorld): void {
		console.log("handle method of --helloworld--:", { arg, kwargs })
	}
}

module.exports = Command__HelloWorld
