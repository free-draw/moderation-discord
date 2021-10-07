import { REST } from "@discordjs/rest"
import { APIVersion, Routes, Snowflake } from "discord-api-types/v9"
import { ApplicationCommandPermissionData, CommandInteraction, Interaction, Collection } from "discord.js"
import { readdir } from "fs/promises"
import { resolve } from "path"
import Bot from "../Bot"
import { Command, CommandPermissions } from "../interface/Command"
import Resolver from "../Resolver"
import log from "../util/log"
import { ResolverRoles } from "./Resolver"

type BasicApplicationCommandData = {
	id: Snowflake,
	name: string,
}

async function loadCommands(): Promise<Command[]> {
	const files = await readdir(resolve(__dirname, "../commands"))
	const commands = [] as Command[]

	for (const fileName of files) {
		const command = (await import(`../commands/${fileName}`)).default as Command
		commands.push(command)
	}

	return commands
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

class Commands {
	public name: string = "commands"

	public bot: Bot
	public commands: Collection<string, Command> = new Collection()

	constructor(bot: Bot) {
		this.bot = bot

		this.bot.resolver.on("resolve", this.onResolve.bind(this))
		this.bot.client.on("interactionCreate", this.onInteraction.bind(this))
	}

	public async onResolve(roles: ResolverRoles): Promise<void> {
		log.debug("Loading commands")

		const commands = await loadCommands()
		commands.forEach((command) => this.commands.set(command.name, command))

		log.debug("Building commands")

		const body = commands.map((command) => {
			const builder = command.build()

			builder.setName(command.name)
			if (command.permissions) builder.setDefaultPermission(command.permissions.default)

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

	public async onInteraction(interaction: Interaction): Promise<void> {
		if (interaction.isCommand()) {
			const name = (interaction as CommandInteraction).commandName
			const command = this.commands.get(name)

			if (command) {
				await command.execute(interaction)
			} else {
				log.error(`Unknown command name: ${name}`)

				await interaction.reply({
					content: `**Internal Error**: Failed to find command \`${name}\` in collection`,
					ephemeral: true,
				})
			}
		}
	}
}

export default Commands