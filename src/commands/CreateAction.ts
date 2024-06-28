
import { ActionType, createAction, getRobloxUsername } from "@free-draw/moderation-client"
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"
import ErrorEmbed from "../embed/Error"
import Command from "../types/interface/Command"
import ms from "ms"
import asDiscord from "../util/asDiscord"
import API from "../util/API"
import ActionEmbed from "../embed/Action"

export default {
	name: "create-action",
	description: "Creates an action on the specified user",

	build(builder: SlashCommandBuilder): void {
		builder.addStringOption((option) => {
			return option
				.setName("username")
				.setRequired(true)
				.setDescription("Username of the user to create an action on")
		})

		builder.addStringOption((option) => {
			return option
				.setName("type")
				.setRequired(true)
				.setDescription("Type of action to create")
				.addChoices([
					{ name: "Ban", value: ActionType.BAN },
					{ name: "Draw-ban", value: ActionType.DRAWBAN },
					{ name: "Mute", value: ActionType.MUTE },
				])
		})

		builder.addStringOption((option) => {
			return option
				.setName("reason")
				.setRequired(true)
				.setDescription("Reason for the action")
		})

		builder.addStringOption((option) => {
			return option
				.setName("duration")
				.setRequired(false)
				.setDescription("Duration of the action")
		})
	},

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const username = interaction.options.getString("username", true)
		const type = interaction.options.getString("type", true) as ActionType
		const reason = interaction.options.getString("reason", true)
		const duration = interaction.options.getString("duration")

		let parsedDuration: number | undefined

		if (duration) {
			try {
				parsedDuration = ms(duration)
			} catch {
				await interaction.reply({
					embeds: [
						await ErrorEmbed("Invalid duration"),
					],
				})
				return
			}
		}

		await interaction.deferReply({ ephemeral: true })

		const api = asDiscord(API, interaction.user)
		const robloxUser = await getRobloxUsername(api, username)

		if (robloxUser) {
			const action = await createAction(api, robloxUser.id, {
				type,
				reason,
				duration: parsedDuration ? parsedDuration / 1000 : undefined,
			})

			await interaction.editReply({
				content: `Successfully created action on user ${robloxUser.name} (${robloxUser.id})`,
				embeds: [
					await ActionEmbed(action),
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