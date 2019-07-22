const glob = require("glob")
const path = require("path")

export class CommandLoader {    
    public static load(app: any) {
        glob.sync(__dirname + "/commands/**/*.cmd.ts").forEach(function(file: any) {
            let commandClass = require(file)
            new commandClass(new commandClass()).load(app)
        })
    }
}
