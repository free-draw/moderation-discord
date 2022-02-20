import { AccountPlatform, ModeratorAccount } from "@free-draw/moderation-client"
import { Embed } from "discord.js"
import colors from "../util/resource/colors"

const accountPlatformNames = {
	[AccountPlatform.DISCORD]: "Discord",
	[AccountPlatform.ROBLOX]: "Roblox",
}

async function ModeratorAccountEmbed(account: ModeratorAccount): Promise<Embed> {
	return new Embed({
		title: `${accountPlatformNames[account.platform]} Account`,
		description: account.id.toString(),
		color: colors.brand,
	})
}

export default ModeratorAccountEmbed