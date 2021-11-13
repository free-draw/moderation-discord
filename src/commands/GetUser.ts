import { SlashCommandBuilder } from "@discordjs/builders"
import { getRobloxThumbnail, getRobloxUsername, getUser, RobloxThumbnailType } from "@free-draw/moderation-client"
import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js"
import Command from "../types/interface/Command"
import API from "../util/API"
import asDiscord from "../util/asDiscord"
import colors from "../util/resource/colors"

class GetUserCommand implements Command {
	public name = "user"
	public permissions = {
		default: false,
		roles: {
			admin: true,
			mod: true,
			trialMod: true,
		},
	}

	public build(): SlashCommandBuilder {
		const builder = new SlashCommandBuilder()

		builder.setDescription("Get a user's information")
		builder.addStringOption((option) => {
			return option
				.setName("username")
				.setRequired(true)
				.setDescription("User to get information about")
		})

		return builder
	}

	public async execute(interaction: CommandInteraction): Promise<void> {
		await interaction.deferReply({ ephemeral: true })

		const username = interaction.options.getString("username", true)

		const api = asDiscord(API, interaction.user)
		const robloxUser = await getRobloxUsername(api, username)
		const avatar = await getRobloxThumbnail(api, {
			id: robloxUser.id,
			type: RobloxThumbnailType.AVATAR_HEADSHOT,
			size: "100x100",
		})
		const user = await getUser(api, robloxUser.id)

		const activeActions = user.actions.filter(filterAction => filterAction.active).length
		const inactiveActions = user.actions.filter(filterAction => !filterAction.active).length

		await interaction.editReply({
			embeds: [
				new MessageEmbed({
					author: {
						name: `${robloxUser.name} (${robloxUser.id})`,
						url: `https://www.roblox.com/users/${robloxUser.id}/profile`,
						iconURL: avatar,
					},
					fields: [
						{
							name: "Actions",
							value: `${activeActions} *(+${inactiveActions} inactive)*`,
						},
					],
					color: activeActions > 0 ? colors.userHasActions : colors.userHasNoActions,
					footer: { text: `Hint: Use /actions ${robloxUser.name} to see their actions` }
				}),
			],
		})
	}
}

export default new GetUserCommand()