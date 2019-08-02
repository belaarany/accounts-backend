import "reflect-metadata"
import * as http from "http"
import * as dotenv from "dotenv"
import * as winston from "winston"
import * as bodyParser from "body-parser"
import * as glob from "glob"
import * as path from "path"
import express from "express"
import camelcaseKeys from "camelcase-keys"
import typeORM, { createConnection } from "typeorm"
import { Controller } from "~app/interfaces/controller.interface"
import { httpDebugMiddleware } from "@middlewares/httpDebug.middleware"
import { preProcessRequestMiddleware, postProcessResponseMiddleware } from "@middlewares/processResponse.middleware"
import { createWinston } from "@utils/createWinston"
import { validateEnv } from "@utils/validateEnv"

class App {
    private express!: express.Application
    private databaseConnection!: typeORM.Connection
    private _applicationStart!: number

    constructor() {

    }

    public bootstrap(): Promise<App> {
        return new Promise((resolve: (app: App) => void, reject: () => void) => {
            this._applicationStart = Date.now()

            // Pre-requirements
            this.registerWinstonLogger()

            winston.info("Application booting...")

            // Express
            this.express = express()

            // After-requirements
            this.registerEnvironmentVariables()
            this.registerMiddlewares()

            // Requirements that use promise
            Promise.all<typeORM.Connection>([
                this.createDatabaseConnection()
            ])
            .then((results) => {
                let connection: typeORM.Connection = results[0]

                this.databaseConnection = connection

                // Requirements that use database
                return this.registerControllers()
            })
            .then(() => {
                winston.info(`Application booted in ${Date.now() - this._applicationStart} ms`)

                resolve(this.getApp())
            })
            .catch((error: any) => {
                winston.error("Application cannot boot, error occurred")
                winston.debug(`Application boot --> ${JSON.stringify(error)} | ${error}`)
            })
        })
    }

    public getApp(): App {
        return this
    }

    public getExpress(): express.Application {
        return this.express
    }

    public getDatabaseConnection(): typeORM.Connection {
        return this.databaseConnection
    }

    private registerWinstonLogger(): void {
        createWinston()
    }

    private registerEnvironmentVariables(): void {
        dotenv.config()

        validateEnv()
    }

    private registerMiddlewares(): void {
        this.express.use(bodyParser.json())
        this.express.use(httpDebugMiddleware())
        this.express.use(postProcessResponseMiddleware())
        this.express.use(preProcessRequestMiddleware())
    }

    private registerControllers(): Promise<void> {
        return new Promise((resolve: () => void, reject: (error?: any) => void) => {
            Promise.all(glob.sync(__dirname + "/controllers/**/*.controller.ts").map(function(file: any) {
                winston.debug(`Controller found --> file: '${path.basename(file)}'`)
                return import(file)
            }))
            .then((controllers: any) => {
                controllers.forEach((controller: { default: (new() => Controller) }) => {
                    let _defaultExport: (new() => Controller) = controller.default
                    let _class = new _defaultExport()
                    _class.registerRoutes()
    
                    this.express.use(_class.path, _class.router)
    
                    winston.debug(`Controller imported --> path: '${_class.path}'`)
                })

                winston.info("Controllers imported")
    
                resolve()
            })
        })
    }

    private createDatabaseConnection(): Promise<typeORM.Connection> {        
        return new Promise((resolve: (connection: typeORM.Connection) => void, reject: (error?: any) => void) => {
            createConnection()
            .then((connection: typeORM.Connection) => {
                winston.info("Database connection successfully initiated")
                winston.debug(`Database connection --> type: '${connection.options.type}' | database: '${connection.options.database}'`)

                this.databaseConnection = connection
                
                resolve(connection)
            })
            .catch((error: any) => {
                winston.error(`Database connection failed: '${error}'`)
                winston.debug(JSON.stringify(error))

                reject(error)
            })
        })
    }
}

export { App }
