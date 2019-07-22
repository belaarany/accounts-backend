import Vorpal = require("vorpal")
const clear =require("clear")

import { CommandLoader } from "./loader"

const app = new Vorpal()

CommandLoader.load(app)

clear()

app
.delimiter("goabela-accounts-cli$")
.show()
