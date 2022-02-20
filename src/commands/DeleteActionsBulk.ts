import { SlashCommandBuilder } from "@discordjs/builders"
import { ActionType, deleteActionsBulk, getRobloxUsername } from "@free-draw/moderation-client"
import { ChatInputCommandInteraction } from "discord.js"
import ErrorEmbed from "../embed/Error"
import Command from "../types/interface/Command"
import API from "../util/API"
import asDiscord from "../util/asDiscord"

class DeleteActionsBulk implements Command {
	public name = "delete-actions-bulk"
	public description = "Deletes all actions from a user that match specified criteria"
	public permissions = {
		default: false,
		roles: {
			admin: true,
			mod: true,
			trialMod: true,
		},
	}

	public build(builder: SlashCommandBuilder): void {
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
				.addChoice({ name: "Ban", value: ActionType.BAN })
				.addChoice({ name: "Draw-ban", value: ActionType.DRAWBAN })
				.addChoice({ name: "Mute", value: ActionType.MUTE })
		})
	}

	public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
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