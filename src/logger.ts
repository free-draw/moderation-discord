import winston from "winston"

const logger = winston.createLogger({
	level: "info",
	transports: [
		new winston.transports.Console({
			format: process.env.NODE_ENV === "production"
				? winston.format.json()
				: winston.format.simple(),
		}),
	],
})

export default logger