import { APIVersion, Routes, Snowflake } from "discord-api-types/v10"
import { Interaction, Collection, SlashCommandBuilder, REST } from "discord.js"
import { resolve } from "path"
import Bot from "../Bot"
import ErrorEmbed from "../builders/embed/Error"
import Command from "../types/interface/Command"
import Service from "../types/interface/Service"
import bulkImport from "../util/bulkImport"
import log from "../util/log"

type BasicApplicationCommandData = {
	id: Snowflake,
	name: string,
}

class CommandDispatcher implements Service {
	public bot: Bot
	public commands: Collection<string, Command> = new Collection()

	constructor(bot: Bot) {
		this.bot = bot

		bot.resolver.on("resolve", this.onResolve.bind(this))
		bot.client.on("interactionCreate", this.onInteraction.bind(this))
	}

	private async onResolve(): Promise<void> {
		log.debug("Loading commands")

		// BUILD COMMAND DATA //

		const commands = await bulkImport<Command>(resolve(__dirname, "../commands"), true)
		commands.forEach((command) => this.commands.set(command.name, command))
		log.debug(`Found commands: ${[ ...this.commands.keys() ].join(", ")}`)

		log.debug("Building commands")

		const body = commands.map((command) => {
			const builder = new SlashCommandBuilder()

			builder.setName(command.name)
			builder.setDescription(command.description)
			builder.setDefaultMemberPermissions(0)

			command.build(builder)

			return builder.toJSON()
		})

		// REGISTER COMMANDS //

		log.debug(`Registering guild commands for guild ${this.bot.guildId}`)

		const rest = new REST({ version: APIVersion })
		rest.setToken(this.bot.token)

		await rest.put(
			Routes.applicationGuildCommands(this.bot.clientId, this.bot.guildId),
			{ body }
		) as BasicApplicationCommandData[]
	}

	private async onInteraction(interaction: Interaction): Promise<void> {
		if (interaction.isChatInputCommand()) {
			const name = interaction.commandName
			const command = this.commands.get(name)

			if (command) {
				try {
					await command.execute.call(this.bot, interaction)
				} catch (error) {
					const data = {
						embeds: [
							await ErrorEmbed([
								"Command failed to execute",
								"",
								"```",
								(error as Error).toString(),
								"```",
							].join("\n")),
						],
					}

					if (interaction.replied || interaction.deferred) {
						interaction.editReply(data)
					} else {
						interaction.reply(data)
					}
				}
			} else {
				log.error(`Unknown command name: ${name}`)

				await interaction.reply({
					embeds: [
						await ErrorEmbed(`Failed to find command \`${name}\` in collection`),
					],
					ephemeral: true,
				})
			}
		}
	}
}

export default CommandDispatcher