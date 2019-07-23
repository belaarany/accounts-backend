import * as envalid from "envalid"
import * as winston from "winston"

const validateEnv = (): void => {
    const validators: object = {
        APP_PORT: envalid.port(),
        PASSWORD_SALT: envalid.str(),
    }

    const options: envalid.CleanOptions = {
        reporter: (result: any) => {
            if (Object.keys(result.errors).length === 0) {
                winston.info("Environment variables loaded successfully")
            }
            else {
                winston.error("Environment variables cannot be loaded: " + JSON.stringify(result.errors))

                throw new Error("Environment variables cannot be loaded")
            }
        }
    }

    envalid.cleanEnv(process.env, validators, options)
}

export { validateEnv }
