import { Snowflake } from "discord-api-types/globals"
import path from "path"
import root from "app-root-path"
import env from "./env"

type Config = {
	guild: Snowflake,
	channels: Record<string, Snowflake>,
	roles: Record<string, Snowflake>,
}

const file = env.configFile ?? path.resolve(root.path, "config.json")
const config = require(file)

export default config as Config