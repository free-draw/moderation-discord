import { AccountPlatform, ModeratorAccount } from "@free-draw/moderation-client"
import { MessageEmbed } from "discord.js"
import colors from "../util/resource/colors"

const accountPlatformNames = {
	[AccountPlatform.DISCORD]: "Discord",
	[AccountPlatform.ROBLOX]: "Roblox",
}

async function ModeratorAccountEmbed(account: ModeratorAccount): Promise<MessageEmbed> {
	return new MessageEmbed({
		title: `${accountPlatformNames[account.platform]} Account`,
		description: account.id.toString(),
		color: colors.brand,
	})
}

export default ModeratorAccountEmbed