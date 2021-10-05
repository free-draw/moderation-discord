import path from "path"
import root from "app-root-path"
import { Snowflake } from "discord-api-types"

interface IConfig {
	channels: { [name: string]: Snowflake },
	roles: { [name: string]: Snowflake },
}

const file = process.env.CONFIG_FILE ?? path.resolve(root.path, "config.json")
const config = require(file)

export default config as IConfig