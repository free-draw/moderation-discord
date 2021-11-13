import { SlashCommandBuilder } from "@discordjs/builders"
import { Action, deleteAction, getRobloxUsername } from "@free-draw/moderation-client"
import { CommandInteraction } from "discord.js"
import ErrorEmbed from "../embed/Error"
import Command from "../types/interface/Command"
import API from "../util/API"
import asDiscord from "../util/asDiscord"

class DeleteActionCommand implements Command {
	public name = "deleteaction"
	public permissions = {
		default: false,
		roles: {
			admin: true,
			mod: true,
			trialMod: true,
		},
	}

	public build(): SlashCommandBuilder {
		const command = new SlashCommandBuilder()

		command.setDescription("Deletes an action on a user")
		command.addStringOption((option) => {
			return option
				.setName("username")
				.setRequired(true)
				.setDescription("Username of the user to delete an action from")
		})
		command.addStringOption((option) => {
			return option
				.setName("id")
				.setRequired(true)
				.setDescription("ID of the action to delete")
		})

		return command
	}

	public async execute(interaction: CommandInteraction): Promise<void> {
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
	}
}

export default new DeleteActionCommand()