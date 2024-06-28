import { program } from "commander"

type Args = {
	debug: boolean,
}

program.option("-d, --debug")
program.parse()

export default program.opts() as Args