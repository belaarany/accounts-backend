import Vorpal from "vorpal"
import clear from "clear"
import { CommandLoader } from "./loader"
import { App } from "../app/app"

const cli = new Vorpal()
const app: App = new App()

clear()

app.bootstrap()
.then(() => {
    CommandLoader.load({
        cli: cli,
        app: app,
    })

    clear()
    printMOTD()
    
    cli
    .delimiter("goabela-accounts-cli$")
    .show()
})

function printMOTD(): void {
    console.log("===========================================")
    console.log("Welcome to the GOabela Accounts CLI")
    console.log()
    console.log("To list the available commands, type \'help\'")
    console.log("===========================================")
    console.log()
}

function onExit(): void {
    //server.shutdown()
}

process.on("SIGINT",  onExit)
process.on("exit", onExit)
