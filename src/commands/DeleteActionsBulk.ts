import { ActionType, deleteActionsBulk, getRobloxUsername } from "@free-draw/moderation-client"
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"
import ErrorEmbed from "../embed/Error"
import Command from "../types/interface/Command"
import API from "../util/API"
import asDiscord from "../util/asDiscord"

export default {
	name: "delete-actions-bulk",
	description: "Deletes all actions from a user that match specified criteria",
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
				.setDescription("Username of the user to delete actions from")
		})

		builder.addStringOption((option) => {
			return option
				.setName("type")
				.setRequired(true)
				.setDescription("Type of action to delete")
				.addChoices([
					{ name: "Ban", value: ActionType.BAN },
					{ name: "Draw-ban", value: ActionType.DRAWBAN },
					{ name: "Mute", value: ActionType.MUTE },
				])
		})
	},

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const username = interaction.options.getString("username", true)
		const type = interaction.options.getString("type", true) as ActionType

		await interaction.deferReply({ ephemeral: true })

		const api = asDiscord(API, interaction.user)
		const robloxUser = await getRobloxUsername(api, username)

		if (robloxUser) {
			const actions = await deleteActionsBulk(api, robloxUser.id, {
				type,
			})

			await interaction.editReply(`Successfully deleted ${actions.length} action(s)`)
		} else {
			interaction.editReply({
				embeds: [
					await ErrorEmbed(`Roblox user with username "${username}" doesn't exist`)
				],
			})
		}
	},
} as Command