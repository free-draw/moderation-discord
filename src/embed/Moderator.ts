import { AccountPlatform, Moderator } from "@free-draw/moderation-client"
import { MessageEmbed } from "discord.js"
import colors from "../util/resource/colors"

const accountPlatformNames = {
	[AccountPlatform.DISCORD]: "Discord",
	[AccountPlatform.ROBLOX]: "Roblox",
}

async function ModeratorEmbed(moderator: Moderator): Promise<MessageEmbed> {
	return new MessageEmbed({
		title: moderator.name,
		fields: [
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
		],
		color: colors.brand,
	})
}

export default ModeratorEmbed