import { MessageCreateOptions } from "discord.js"

type LoggerCategory = {
	channel: string,
	events: {
		[name: string]: (data: any) => Promise<MessageCreateOptions>,
	},
}

export default LoggerCategory