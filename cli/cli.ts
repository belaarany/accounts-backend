const chalk = require("chalk")
const clear = require("clear")
const glob = require("glob")
const path = require("path")

const stdin = process.openStdin()

var commands: {
	[command: string]: any
} = {}

clear()
console.log(chalk.blue.bold("Welcome to the GOabela Accounts CLI"))
console.log("To exit the CLI, enter command `exit`")
console.log("")

const readingLine = (callback: any): void => {
	process.stdout.write(">>> ")

	stdin.addListener("data", function(stream) {
		let formattedStream = stream.toString().trim()

		callback(formattedStream)

		process.stdout.write("\n>>> ")
	})
}

const readCommands = (): void => {
	//console.log("[DEBUG] Loading commands...")

	glob.sync(__dirname + "/commands/**/*.cmd.ts").forEach(function(file: any) {
		let _commandClass = require(file)
		let _commandInstance = new _commandClass()

		commands[_commandInstance.command] = _commandInstance

		//console.log(`[DEBUG] Command \`${_commandInstance.command}\` loaded.`)
	})

	//console.log("[DEBUG] All commands loaded", { commands })
}

readCommands()

readingLine((str: string) => {
	//console.log("Line read:", str)

	if (str === "exit") {
		console.log("Exiting...")
		process.exit()
	}

	if (str === "help") {
		Object.values(commands).forEach((command) => {
			console.log(
				`${command.command} [${command.argument}]: ${command.description}`
			)

			Object.keys(command.keywordArguments).forEach((keywordArgument) => {
				console.log(
					`  --${keywordArgument}=[value]: ${command.keywordArguments[keywordArgument]}`
				)
			})

			console.log("")
		})
	}
})
