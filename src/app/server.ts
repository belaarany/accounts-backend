import * as http from "http"
import * as winston from "winston"
import express from "express"
import { App } from "~app/app"

class Server {
	private app: App
	private server!: http.Server

	constructor(app: App) {
		this.app = app

		winston.info("Server instantiated")
	}

	public listen(port: number | "@env"): Promise<void> {
		return new Promise((resolve: () => void, reject: () => void) => {
			if (port === "@env") {
				port = Number(process.env.APP_PORT || "8020")
			}

			let express: express.Application = this.app.getExpress()

			this.server = express.listen(port, () => {
				// @ts-ignore
				let at = this.server.address().address
				winston.info(
					`Server started listening at '${at}${port}' in env '${
						express.settings.env
					}'`
				)

				resolve()
			})
		})
	}

	public shutdown(): Promise<void> {
		return new Promise((resolve: () => void, reject: () => void) => {
			let server: http.Server = this.server

			server.close(() => {
				winston.info("Server did shutdown")

				resolve()
			})
		})
	}
}

export { Server }
