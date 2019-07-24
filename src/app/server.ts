import * as http from "http"
import * as dotenv from "dotenv"
import * as winston from "winston"
import express from "express"
import { App } from "./app"
import { createWinston, validateEnv } from "./utils"

import { CarsController } from "./controllers/cars.controller"

class Server {
    private appInstance!: App

    constructor() {

    }

    public start(): Promise<void> {
        return new Promise((resolve: () => void, reject: () => void) => {
            // Pre-requirements
            this.registerWinstonLogger()

            // Sending log
            winston.info("Server starting...")

            // After-requirements
            this.registerEnvironmentVariables()

            // Start
            this.startApplication()
            .then(resolve)
        })
    }

    public shutdown(): Promise<void> {
        return new Promise((resolve: () => void, reject: () => void) => {
            let server: http.Server = this.appInstance.getServer()
            
            server.close(() => {
                winston.info("Server did shutdown")

                resolve()
            })
        })
    }

    public getApp(): App {
        return this.appInstance.getApp()
    }

    public getExpress(): express.Application {
        return this.appInstance.getExpress()
    }

    public getServer(): http.Server {
        return this.appInstance.getServer()
    }

    private registerWinstonLogger(): void {
        createWinston()
    }

    private registerEnvironmentVariables(): void {
        dotenv.config()

        validateEnv()
    }

    private startApplication(): Promise<void> {
        return new Promise((resolve: () => void, reject: () => void) => {
            this.appInstance = new App({
                port: parseInt(process.env.APP_PORT || "8070"),
                controllers: [
                    CarsController,
                ],
            })

            this.appInstance.start()
            .then(resolve)
        })
    }
}

export { Server }
