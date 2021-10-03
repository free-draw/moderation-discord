import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction } from "discord.js"
import ICommand from "../interface/ICommand"

class TestCommand implements ICommand {
	public name: string = "test"

	public build(): SlashCommandBuilder {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription("Test command")
	}

	public async execute(interaction: CommandInteraction) {
		await interaction.reply({
			content: "hello world!",
			ephemeral: true,
		})
	}
}

export default new TestCommand()