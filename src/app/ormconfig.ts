import { ConnectionOptions } from "typeorm"

const config: ConnectionOptions = {
   type: "postgres",
   host: "localhost",
   port: 5432,
   username: "postgres",
   password: "root",
   database: "topjoy_001",
   
   synchronize: true,

   entities: [
      "src/app/models/**/*.entity.ts",
   ],
   migrations: [
      "src/app/migrations/**/*.ts",
   ],
}

export default config
