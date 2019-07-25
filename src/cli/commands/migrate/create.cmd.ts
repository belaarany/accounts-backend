import { Args, CommandInstance } from "vorpal"
import { ACommand, ICommandLoad } from "../../interfaces/command.interface"
const clear = require("clear")
const fs = require("fs")
const path = require("path")

module.exports = class extends ACommand {
    public app!: ICommandLoad["app"]

    public load(props: ICommandLoad) {
        this.app = props.app
        
        props.cli
            .command("migrate:create <name>")
            .alias("m:c")
            .description("Creates a migration")
            .option("-t <type>", "Type of the migration (table | change)")
            .action(this.action)
    }

    public action = (args: Args, done: () => void): void => {
        let migrationsPath: string = path.dirname(require.main.filename) + "/../app/migrations/"
        let now: string = String(Date.now())
        let name: string = args.name.toLowerCase()
        let fileName: string = now + "_" + name + ".ts"
        let content =
`import { MigrationInterface, QueryRunner, Table, TableIndex, TableColumn, TableForeignKey } from "typeorm"

export default class ${name}_${now} implements MigrationInterface {
    
    async up(queryRunner: QueryRunner): Promise<any> {
         
    }

    async down(queryRunner: QueryRunner): Promise<any> {
        
    }
    
}
`

        if (args.options.t && args.options.t === "table") {
            migrationsPath += "tables/"
        }
        else {
            migrationsPath += "changes/"
        }

        fs.writeFile(migrationsPath + fileName, content, function(err) {
            if(err) {
                return console.log(err)
            }

            console.log("The file was saved!")

            done()
        })
    }
}
