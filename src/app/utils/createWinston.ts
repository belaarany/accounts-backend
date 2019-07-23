import { format, default as winston } from "winston"

const myFormat = format.printf((info: any) => {
    return `[${info.level.toUpperCase()}]: ${info.message}`
})

const createWinston = (): void => {
    winston.configure({
        transports: [
            new winston.transports.Console({
                level: "debug",
            })
        ],
        format: winston.format.combine(
            format.timestamp(),
            myFormat,
        )
    })
}

export { createWinston }
