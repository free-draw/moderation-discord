import { MessageEmbed } from "discord.js"
import colors from "../util/resource/colors"

async function ErrorEmbed(message: string): Promise<MessageEmbed> {
	return new MessageEmbed({
		title: "Error",
		description: message,
		color: colors.error,
	})
}

export default ErrorEmbed