import yargs from "yargs"
import { hideBin } from "yargs/helpers"

interface IArgs {
	config: string,
}

const args = yargs(hideBin(process.argv))
	.option("config", {
		alias: "c",
		type: "string",
		description: "Config file location",
	})
	.demandOption("config")
	.parse()

export default args as IArgs