import clear from "clear"
import { Server } from "./server"
import { App } from "./App"

clear()

let app: App = new App()
let server: Server | null = null

app.bootstrap()
.then(() => {
    server = new Server(app)
    server.listen("@env")
})
