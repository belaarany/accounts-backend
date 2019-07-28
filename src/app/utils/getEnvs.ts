import { validators } from "./validateEnv"

interface IGetEnvs {
    [key: string]: string | number,
}

const getEnvs = (): IGetEnvs => {
    return Object.keys(process.env)
        .filter((key: any) => Object.keys(validators).includes(key))
        .reduce((obj: any, key: any) => ({ ...obj, [key]: process.env[key] }), {})
}

export { IGetEnvs, getEnvs }
