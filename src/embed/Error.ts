import { Embed } from "discord.js"
import colors from "../util/resource/colors"

async function ErrorEmbed(message: string): Promise<Embed> {
	return new Embed({
		title: "Error",
		description: message,
		color: colors.error,
	})
}

export default ErrorEmbed