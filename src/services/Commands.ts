import { SlashCommandBuilder } from "@discordjs/builders"
import { REST } from "@discordjs/rest"
import { APIVersion, Routes, Snowflake } from "discord-api-types/v9"
import { ApplicationCommandPermissionData, Interaction, Collection } from "discord.js"
import { resolve } from "path"
import Bot from "../Bot"
import ErrorEmbed from "../embed/Error"
import { Command, CommandPermissions } from "../types/interface/Command"
import Service from "../types/interface/Service"
import bulkImport from "../util/bulkImport"
import log from "../util/log"
import { ResolverRoles } from "./Resolver"

type BasicApplicationCommandData = {
	id: Snowflake,
	name: string,
}

function buildPermissions(permissions: CommandPermissions, roles: ResolverRoles): ApplicationCommandPermissionData[] {
	const rolePermissions = permissions.roles
	const userPermissions = permissions.users

	const output = [] as ApplicationCommandPermissionData[]

	if (rolePermissions) {
		for (const roleName in rolePermissions) {
			const role = roles.get(roleName)
			if (!role) throw new Error(`Unknown role "${roleName}"`)

			output.push({
				id: role.id,
				type: "ROLE",
				permission: rolePermissions[roleName],
			})
		}
	}

	if (userPermissions) {
		for (const user in userPermissions) {
			output.push({
				id: user,
				type: "USER",
				permission: userPermissions[user],
			})
		}
	}

	return output
}

class Commands implements Service {
	public bot: Bot
	public commands: Collection<string, Command> = new Collection()

	constructor(bot: Bot) {
		this.bot = bot

		bot.resolver.on("resolve", this.onResolve.bind(this))
		bot.client.on("interactionCreate", this.onInteraction.bind(this))
	}

	private async onResolve(roles: ResolverRoles): Promise<void> {
		log.debug("Loading commands")

		const commands = await bulkImport<Command>(resolve(__dirname, "../commands"), true)
		commands.forEach((command) => this.commands.set(command.name, command))
		log.debug(`Found commands: ${[ ...this.commands.keys() ].join(", ")}`)

		log.debug("Building commands")

		const body = commands.map((command) => {
			const builder = new SlashCommandBuilder()

			builder.setName(command.name)
			builder.setDescription(command.description)
			if (command.permissions) builder.setDefaultPermission(command.permissions.default)

			command.build(builder)

			return builder.toJSON()
		})

		log.debug(`Registering guild commands for guild ${this.bot.guildId}`)

		const rest = new REST({ version: APIVersion })
		rest.setToken(this.bot.token)

		const response = await rest.put(
			Routes.applicationGuildCommands(this.bot.clientId, this.bot.guildId),
			{ body }
		) as BasicApplicationCommandData[]

		log.debug("Setting up command permissions")

		await Promise.all(
			response.map(async (commandData) => {
				const guildCommand = await this.bot.guild?.commands.fetch(commandData.id)

				if (guildCommand) {
					const command = this.commands.get(guildCommand.name)

					if (command?.permissions) {
						log.debug(`Setting permissions for command "${guildCommand.name}"`)

						await guildCommand.permissions.set({
							permissions: buildPermissions(command.permissions, roles),
						})
					}
				}
			})
		)
	}

	private async onInteraction(interaction: Interaction): Promise<void> {
		if (interaction.isCommand()) {
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

export default Commands