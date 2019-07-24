import Vorpal from "vorpal"
import { CommandLoader } from "./loader"
import { Server } from "../app/server"
const clear = require("clear")

const cli = new Vorpal()
const server = new Server()
server.start()
.then(() => {
    CommandLoader.load({
        cli: cli,
        server: server,
    })

    clear()
    
    cli
    .delimiter("goabela-accounts-cli$")
    .show()
})
