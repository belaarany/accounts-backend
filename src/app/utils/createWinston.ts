import { format, default as winston } from "winston"

const myFormat = format.printf((info: any) => {
    return `[${info.level}]: ${info.message}`
})

const createWinston = (): void => {
    winston.configure({
        transports: [
            new winston.transports.Console({
                level: process.env.NODE_ENV === "test" ? "error" : "debug",
            })
        ],
        format: winston.format.combine(
            format.colorize(),
            format.timestamp(),
            myFormat,
        )
    })
}

export { createWinston }
