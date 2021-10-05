import { SlashCommandBuilder } from "@discordjs/builders"
import { Snowflake } from "discord-api-types"
import { CommandInteraction } from "discord.js"

type CommandPermissions = {
	default: boolean,
	roles?: { [role: string]: boolean },
	users?: { [user: Snowflake]: boolean },
}

interface Command {
	name: string,
	permissions?: CommandPermissions,
	build(): SlashCommandBuilder,
	execute(interaction: CommandInteraction): Promise<void> | void,
}

export default Command
export { Command, CommandPermissions }