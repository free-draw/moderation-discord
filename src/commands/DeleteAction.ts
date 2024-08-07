import { deleteAction, getRobloxUsername } from "@free-draw/moderation-client"
import ErrorEmbed from "../builders/embed/Error"
import Command from "../types/interface/Command"
import API from "../util/API"
import asDiscord from "../util/asDiscord"

export default {
	name: "delete-action",
	description: "Deletes an action on a user",

	build(builder): void {
		builder.addStringOption((option) => {
			return option
				.setName("username")
				.setRequired(true)
				.setDescription("Username of the user to delete an action from")
		})

		builder.addStringOption((option) => {
			return option
				.setName("id")
				.setRequired(true)
				.setDescription("ID of the action to delete")
		})
	},

	async execute(interaction) {
		const username = interaction.options.getString("username", true)
		const id = interaction.options.getString("id", true)

		await interaction.deferReply({ ephemeral: true })

		const api = asDiscord(API, interaction.user)
		const robloxUser = await getRobloxUsername(api, username)

		if (robloxUser) {
			try {
				await deleteAction(api, robloxUser.id, id)
			} catch(error) {
				interaction.editReply({
					embeds: [
						await ErrorEmbed(`Failed to delete action with ID ${id}, ensure it exists`),
					],
				})
				return
			}

			await interaction.editReply("Successfully deleted action")
		} else {
			interaction.editReply({
				embeds: [
					await ErrorEmbed(`Roblox user with username "${username}" doesn't exist`)
				],
			})
		}
	},
} as Command