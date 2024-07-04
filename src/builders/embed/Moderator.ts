import { AccountPlatform, Moderator } from "@free-draw/moderation-client"
import { EmbedBuilder } from "discord.js"
import colors from "../../util/resource/colors"

const accountPlatformNames = {
	[AccountPlatform.DISCORD]: "Discord",
	[AccountPlatform.ROBLOX]: "Roblox",
}

async function ModeratorEmbed(moderator: Moderator): Promise<EmbedBuilder> {
	return new EmbedBuilder()
		.setTitle(moderator.name)
		.setFields([
			{
				name: "Active",
				value: moderator.active ? "Yes" : "No",
			},
			{
				name: "Permissions",
				value: moderator.permissions.map(permission => `\`${permission}\``).join(", ")
			},
			{
				name: "Accounts",
				value: moderator.accounts.map(account => `${accountPlatformNames[account.platform]} - ${account.id}`).join("\n"),
			},
		])
		.setFooter({ text: `ID: ${moderator.id}` })
		.setColor(colors.brand)
}

export default ModeratorEmbed