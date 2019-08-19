import * as envalid from "envalid"
import * as winston from "winston"
import { IGetEnvs, getEnvs } from "./getEnvs"

const validators: object = {
    APP_TOKEN_SECRET: envalid.str(),
    APP_PORT: envalid.port(),
    APP_URL: envalid.url(),
    APP_DEV_BEARER_TOKEN: envalid.str(),

    TYPEORM_CONNECTION: envalid.str(),
    TYPEORM_HOST: envalid.host(),
    TYPEORM_PORT: envalid.port(),
    TYPEORM_USERNAME: envalid.str(),
    TYPEORM_PASSWORD: envalid.str(),
    TYPEORM_DATABASE: envalid.str(),
    TYPEORM_SYNCHRONIZE: envalid.bool(),
    TYPEORM_ENTITIES: envalid.str(),
    TYPEORM_MIGRATIONS: envalid.str(),
    TYPEORM_LOGGING: envalid.str(),
}

const validateEnv = (): void => {
    const options: envalid.CleanOptions = {
        reporter: (result: any) => {
            if (Object.keys(result.errors).length === 0) {
                winston.info("Environment variables loaded successfully")

                const envFiltered: IGetEnvs = getEnvs()

                winston.debug(`Env --> ${JSON.stringify(envFiltered)}`)
            }
            else {
                winston.error("Environment variables cannot be loaded: " + JSON.stringify(result.errors))

                throw new Error("Environment variables cannot be loaded")
            }
        }
    }

    envalid.cleanEnv(process.env, validators, options)
}

export { validateEnv, validators }
