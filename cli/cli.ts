import Vorpal from "vorpal"
import { CommandLoader } from "./loader"
const clear = require("clear")

const app = new Vorpal()

CommandLoader.load(app)

clear()

app
.delimiter("goabela-accounts-cli$")
.show()
