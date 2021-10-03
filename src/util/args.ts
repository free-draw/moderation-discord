import yargs from "yargs"
import { hideBin } from "yargs/helpers"

interface IArgs {
	verbose: number,
}

const args = yargs(hideBin(process.argv))
	.option("verbose", {
		alias: "v",
		type: "count",
	})
	.parse()

export default args as IArgs