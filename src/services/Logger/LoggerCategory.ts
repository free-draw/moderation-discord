import { MessageOptions } from "discord.js"

type LoggerCategory = {
	channel: string,
	events: {
		[name: string]: (data: any) => Promise<MessageOptions>,
	},
}

export default LoggerCategory