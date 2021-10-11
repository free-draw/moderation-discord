import path from "path"
import root from "app-root-path"
import { Snowflake } from "discord-api-types"
import env from "./env"

type Config = {
	channels: { [name: string]: Snowflake },
	roles: { [name: string]: Snowflake },
}

const file = env.configFile ?? path.resolve(root.path, "config.json")
const config = require(file)

export default config as Config