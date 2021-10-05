import path from "path"
import root from "app-root-path"

interface IConfig {
	channels: { [name: string]: string },
	roles: { [name: string]: string },
}

const file = process.env.CONFIG_FILE ?? path.resolve(root.path, "config.json")
const config = require(file)

export default config as IConfig