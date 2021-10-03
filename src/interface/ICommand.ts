import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction } from "discord.js"

interface ICommand {
	name: string,
	build(): SlashCommandBuilder,
	execute(interaction: CommandInteraction): Promise<void> | void,
}

export default ICommand