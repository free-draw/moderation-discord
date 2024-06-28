import { CommandInteraction, SlashCommandBuilder } from "discord.js"
import Bot from "../../Bot"

interface Command {
	name: string,
	description: string,
	build(builder: SlashCommandBuilder): void,
	execute(this: Bot, interaction: CommandInteraction): Promise<void> | void,
}

export default Command