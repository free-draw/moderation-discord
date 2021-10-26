import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js"
import API from "../API"
import getRobloxUsername from "../api/method/roblox/getRobloxUsername"
import getUser from "../api/method/users/getUser"
import ActionEmbed from "../embed/Action"
import Command from "../interface/Command"
import colors from "../util/resource/colors"
import link from "../util/resource/link"

const LIMIT = 5

class ModerationActionsCommand implements Command {
	public name = "actions"
	public permissions = {
		default: false,
		roles: {
			admin: true,
			mod: true,
			trialMod: false,
		},
	}

	public build() {
		const builder = new SlashCommandBuilder()

		builder.setDescription("Gets latest actions on a user")
		builder.addStringOption((option) => {
			return option
				.setName("username")
				.setDescription("Username for the requested user")
				.setRequired(true)
		})

		return builder
	}

	public async execute(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true })

		const username = interaction.options.getString("username", true)

		const api = API.asDiscord(interaction.user)
		const robloxUser = await getRobloxUsername(api, username)
		const user = await getUser(api, robloxUser.id)

		const actions = [ ...user.actions, ...user.history ]
		actions.sort((A, B) => B.timestamp.getTime() - A.timestamp.getTime())

		await interaction.editReply({
			content: `Showing **${Math.min(LIMIT, actions.length)}** of **${actions.length}** actions on Roblox user [${robloxUser.name}](${link.roblox.profile(robloxUser.id)})`,

			embeds: await Promise.all(actions.map(ActionEmbed).slice(0, LIMIT)),

			components: [
				new MessageActionRow({
					components: [
						new MessageButton({
							label: "View on Moderation Hub",
							url: link.moderation.user(robloxUser.id),
							style: "LINK",
						}),
					],
				})
			],
		})
	}
}

export default new ModerationActionsCommand()