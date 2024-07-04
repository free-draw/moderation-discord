import { AccountPlatform, ModeratorAccount } from "@free-draw/moderation-client"
import { EmbedBuilder } from "discord.js"
import colors from "../../util/resource/colors"

const accountPlatformNames = {
	[AccountPlatform.DISCORD]: "Discord",
	[AccountPlatform.ROBLOX]: "Roblox",
}

async function ModeratorAccountEmbed(account: ModeratorAccount): Promise<EmbedBuilder> {
	return new EmbedBuilder()
		.setTitle(`${accountPlatformNames[account.platform]} Account`)
		.setDescription(account.id.toString())
		.setColor(colors.brand)
}

export default ModeratorAccountEmbed