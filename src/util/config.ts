import path from "path"
import args from "./args"

interface IConfig {
	channels: { [name: string]: string },
}

const config = require(path.resolve(process.cwd(), args.config))

export default config as IConfig