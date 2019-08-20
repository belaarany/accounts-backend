import clear from "clear"
import { Server } from "~app/server"
import { App } from "~app/app"

clear()

let app: App = new App()
let server: Server | null = null

app.bootstrap().then(() => {
	server = new Server(app)
	server.listen("@env")
})
