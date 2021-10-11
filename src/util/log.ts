import winston from "winston"
import args from "./option/args"

const log = winston.createLogger({
	level: args.verbose > 0 ? "debug" : "info",
	transports: [
		new winston.transports.Console({
			format: process.env.NODE_ENV === "production"
				? winston.format.json()
				: winston.format.simple(),
		}),
	],
})

export default log