const chalk = require("chalk")
const clear = require("clear")
const stdin = process.openStdin()

clear()
console.log(chalk.blue.bold("Welcome to the GOabela Accounts CLI"))

const readingLine = (callback: any): void => {
	stdin.addListener("data", function(stream) {
		let formattedStream = stream.toString().trim()

		callback(stream)
	})
}

readingLine((str: string) => console.log("Line read:", str))
