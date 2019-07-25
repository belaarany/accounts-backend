import { Server } from "./server"
import { App } from "./App"

let app: App = new App()
let server: Server | null = null

app.bootstrap()
.then(() => {
    server = new Server(app)
    server.listen("@env")
})
