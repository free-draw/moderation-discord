import { SlashCommandBuilder } from "@discordjs/builders"
import { Snowflake } from "discord-api-types/v10"
import { CommandInteraction } from "discord.js"
import Bot from "../../Bot"

type CommandPermissions = {
	default: boolean,
	roles?: { [role: string]: boolean },
	users?: { [user: Snowflake]: boolean },
}

interface Command {
	name: string,
	description: string,
	permissions?: CommandPermissions,
	build(builder: SlashCommandBuilder): void,
	execute(this: Bot, interaction: CommandInteraction): Promise<void> | void,
}

export default Command
export { Command, CommandPermissions }