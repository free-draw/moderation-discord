import { EmbedBuilder } from "discord.js"
import colors from "../../util/resource/colors"

async function ErrorEmbed(message: string): Promise<EmbedBuilder> {
	return new EmbedBuilder()
		.setTitle("Error")
		.setDescription(message)
		.setColor(colors.error)
}

export default ErrorEmbed