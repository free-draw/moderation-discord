import { AccountPlatform, Moderator } from "@free-draw/moderation-client"
import { Embed } from "discord.js"
import colors from "../util/resource/colors"

const accountPlatformNames = {
	[AccountPlatform.DISCORD]: "Discord",
	[AccountPlatform.ROBLOX]: "Roblox",
}

async function ModeratorEmbed(moderator: Moderator): Promise<Embed> {
	return new Embed({
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
		footer: { text: `ID: ${moderator.id}` },
		color: colors.brand,
	})
}

export default ModeratorEmbed