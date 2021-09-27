require("make-promises-safe")

import dotenv from "dotenv"
import path from "path"

dotenv.config({
	path: path.resolve(__dirname, ".env"),
})

import "./src"