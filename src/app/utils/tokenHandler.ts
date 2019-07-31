import Cryptr from "cryptr"
import * as winston from "winston"

const encode = (oid: string, payload?: any): string => {
    if (payload === undefined) payload = {}    

    try {
        let cryptr = new Cryptr(process.env.APP_TOKEN_SECRET)
        return cryptr.encrypt(JSON.stringify({ oid, payload }))
    }
    catch (e) {
        return ""
    }

}

const decode = (token: string): { oid: string, payload: any } => {
    let cryptr = new Cryptr(process.env.APP_TOKEN_SECRET)

    if (token === undefined || token === null || token.length === 0) {
        return { oid: "", payload: {} }
    }

    try {
        return JSON.parse(cryptr.decrypt(token))
    }
    catch (e) {
        return { oid: "", payload: {} }
    }
}

export { encode, decode }
