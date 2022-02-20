import { SlashCommandBuilder } from "@discordjs/builders"
import { getRobloxThumbnail, getRobloxUsername, getUser, RobloxThumbnailType } from "@free-draw/moderation-client"
import { ChatInputCommandInteraction, Embed } from "discord.js"
import ErrorEmbed from "../embed/Error"
import Command from "../types/interface/Command"
import API from "../util/API"
import asDiscord from "../util/asDiscord"
import colors from "../util/resource/colors"

export default {
	name: "get-user",
	description: "Get a user's information",
	permissions: {
		default: false,
		roles: {
			admin: true,
			mod: true,
			trialMod: true,
		},
	},

	build(builder: SlashCommandBuilder): void {
		builder.addStringOption((option) => {
			return option
				.setName("username")
				.setRequired(true)
				.setDescription("User to get information about")
		})
	},

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const username = interaction.options.getString("username", true)

		await interaction.deferReply({ ephemeral: true })

		const api = asDiscord(API, interaction.user)
		const robloxUser = await getRobloxUsername(api, username)

		if (robloxUser) {
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
					new Embed({
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
		} else {
			await interaction.editReply({
				embeds: [
					await ErrorEmbed(`Roblox user with username "${username}" doesn't exist`),
				],
			})
		}
	},
} as Command