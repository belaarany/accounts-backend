import { ConnectionOptions } from "typeorm"

const config: ConnectionOptions = {
   type: "postgres",
   host: process.env.POSTGRES_HOST,
   port: Number(process.env.POSTGRES_PORT),
   username: process.env.POSTGRES_USERNAME,
   password: process.env.POSTGRES_PASSWORD,
   database: process.env.POSTGRES_DATABASE,
   
   synchronize: true,

   entities: [
      "src/app/models/**/*.entity.ts",
   ],
   migrations: [
      "src/app/migrations/**/*.ts",
   ],
}

export default config
