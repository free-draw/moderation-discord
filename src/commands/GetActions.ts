import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import API from "../util/API"
import { getRobloxUsername, getUser } from "@free-draw/moderation-client"
import ActionEmbed from "../builders/embed/Action"
import Command from "../types/interface/Command"
import link from "../util/resource/link"
import asDiscord from "../util/asDiscord"
import ErrorEmbed from "../builders/embed/Error"

const LIMIT = 5

export default {
	name: "get-actions",
	description: "Gets latest actions on a user",

	build(builder): void {
		builder.addStringOption((option) => {
			return option
				.setName("username")
				.setDescription("Username for the requested user")
				.setRequired(true)
		})
	},

	async execute(interaction) {
		const username = interaction.options.getString("username", true)

		await interaction.deferReply({ ephemeral: true })

		const api = asDiscord(API, interaction.user)
		const robloxUser = await getRobloxUsername(api, username)

		if (robloxUser) {
			const user = await getUser(api, robloxUser.id)

			const actions = [ ...user.actions ]
			actions.sort((A, B) => B.created.getTime() - A.created.getTime())

			await interaction.editReply({
				content: `Showing **${Math.min(LIMIT, actions.length)}** of **${actions.length}** actions on Roblox user [${robloxUser.name}](${link.roblox.profile(robloxUser.id)})`,
				embeds: await Promise.all(actions.map(ActionEmbed).slice(0, LIMIT)),
				components: [
					new ActionRowBuilder<ButtonBuilder>()
						.addComponents(
							new ButtonBuilder()
								.setLabel("View on Moderation Hub")
								.setURL(link.moderation.user(robloxUser.id))
								.setStyle(ButtonStyle.Link)
						)
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