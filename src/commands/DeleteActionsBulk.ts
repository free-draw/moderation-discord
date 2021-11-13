import { SlashCommandBuilder } from "@discordjs/builders"
import { ActionType, deleteActionsBulk, getRobloxUsername } from "@free-draw/moderation-client"
import { CommandInteraction } from "discord.js"
import _ from "lodash"
import ErrorEmbed from "../embed/Error"
import Command from "../types/interface/Command"
import API from "../util/API"
import asDiscord from "../util/asDiscord"

class DeleteActionsBulk implements Command {
	public name = "deleteactionsbulk"
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

		command.setDescription("Deletes all actions from a user that match specified criteria")
		command.addStringOption((option) => {
			return option
				.setName("username")
				.setRequired(true)
				.setDescription("Username of the user to delete actions from")
		})
		command.addStringOption((option) => {
			return option
				.setName("type")
				.setRequired(true)
				.setDescription("Type of action to delete")
				.addChoice("Ban", ActionType.BAN)
				.addChoice("Draw-ban", ActionType.DRAWBAN)
				.addChoice("Mute", ActionType.MUTE)
		})

		return command
	}

	public async execute(interaction: CommandInteraction): Promise<void> {
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
	}
}

export default new DeleteActionsBulk()