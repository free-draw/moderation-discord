import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction } from "discord.js"
import Command from "../types/interface/Command"

class TestCommand implements Command {
	public name = "test"

	public build(): SlashCommandBuilder {
		return new SlashCommandBuilder()
			.setDescription("Test command")
	}

	public async execute(interaction: CommandInteraction): Promise<void> {
		await interaction.reply({
			content: "hello world!",
			ephemeral: true,
		})
	}
}

export default new TestCommand()