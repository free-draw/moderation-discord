import { AccountPlatform, findModerator, getModerator, getRobloxUsername, Moderator } from "@free-draw/moderation-client"
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"
import ModeratorEmbed from "../embed/Moderator"
import ErrorEmbed from "../embed/Error"
import Command from "../types/interface/Command"
import API from "../util/API"
import asDiscord from "../util/asDiscord"

export default {
	name: "get-moderator",
	description: "Get a moderator by ID or account",

	build(builder: SlashCommandBuilder): void {
		builder.addSubcommand((subcommand) => {
			subcommand.setName("id")
			subcommand.setDescription("Get a moderator by ID")
			subcommand.addStringOption((option) => {
				return option
					.setName("id")
					.setRequired(true)
					.setDescription("ID of the moderator")
			})

			return subcommand
		})

		builder.addSubcommandGroup((group) => {
			group.setName("account")
			group.setDescription("Get by account")

			group.addSubcommand((subcommand) => {
				subcommand.setName("discord")
				subcommand.setDescription("Get a moderator by Discord account")
				subcommand.addUserOption((option) => {
					return option
						.setName("user")
						.setRequired(true)
						.setDescription("Discord user to search by")
				})

				return subcommand
			})

			group.addSubcommand((subcommand) => {
				subcommand.setName("roblox")
				subcommand.setDescription("Get a moderator by Roblox account")
				subcommand.addStringOption((option) => {
					return option
						.setName("username")
						.setRequired(true)
						.setDescription("Roblox username to search by")
				})

				return subcommand
			})

			return group
		})
	},

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		await interaction.deferReply({ ephemeral: true })

		let moderator: Moderator | undefined

		const api = asDiscord(API, interaction.user)
		const subcommand = interaction.options.getSubcommand(true) as "id" | "discord" | "roblox"

		if (subcommand === "id") {
			const id = interaction.options.getString("id", true)
			moderator = await getModerator(api, id) as Moderator
		} else if (subcommand === "discord") {
			const user = interaction.options.getUser("user", true)
			moderator = await findModerator(api, {
				account: {
					platform: AccountPlatform.DISCORD,
					id: user.id,
				},
			})
		} else if (subcommand === "roblox") {
			const username = interaction.options.getString("username", true)
			const robloxUser = await getRobloxUsername(api, username)
			if (robloxUser) {
				moderator = await findModerator(api, {
					account: {
						platform: AccountPlatform.ROBLOX,
						id: robloxUser.id,
					},
				})
			} else {
				await interaction.editReply({
					embeds: [
						await ErrorEmbed(`Roblox user with username "${username}" doesn't exist`),
					],
				})
			}
		}

		if (moderator) {
			await interaction.editReply({
				embeds: [
					await ModeratorEmbed(moderator),
				],
			})
		} else {
			await interaction.editReply({
				embeds: [
					await ErrorEmbed("Moderator not found"),
				],
			})
		}
	},
} as Command