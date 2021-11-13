import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction, MessageActionRow, MessageButton } from "discord.js"
import API from "../util/API"
import { getRobloxUsername, getUser } from "@free-draw/moderation-client"
import ActionEmbed from "../embed/Action"
import Command from "../types/interface/Command"
import link from "../util/resource/link"
import asDiscord from "../util/asDiscord"

const LIMIT = 5

class GetActionsCommand implements Command {
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

		const api = asDiscord(API, interaction.user)
		const robloxUser = await getRobloxUsername(api, username)
		const user = await getUser(api, robloxUser.id)

		const actions = [ ...user.actions ]
		actions.sort((A, B) => B.created.getTime() - A.created.getTime())

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

export default new GetActionsCommand()