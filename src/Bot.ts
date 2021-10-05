import fs from "fs/promises"
import path from "path"
import { Command, CommandPermissions } from "./interface/Command"
import { REST } from "@discordjs/rest"
import { ApplicationCommandPermissionData, Client, Collection, CommandInteraction, Guild } from "discord.js"
import { Routes, Snowflake } from "discord-api-types/v9"
import logger from "./util/logger"
import Resolver from "./Resolver"

type BasicApplicationCommandData = {
	id: Snowflake,
	name: string,
}

function buildPermissions(permissions: CommandPermissions, resolver: Resolver): ApplicationCommandPermissionData[] {
	const roles = permissions.roles
	const users = permissions.users
		
	const output = [] as ApplicationCommandPermissionData[]

	if (roles) {
		for (const role in roles) {
			output.push({
				id: resolver.getRole(role).id,
				type: "ROLE",
				permission: roles[role],
			})
		}
	}

	if (users) {
		for (const user in users) {
			output.push({
				id: user,
				type: "USER",
				permission: users[user],
			})
		}
	}

	return output
}

class Bot {
	public client: Client
	public commands: Collection<string, Command> = new Collection()
	public guild: Guild | undefined
	public resolver: Resolver

	public clientId: string
	public guildId: string

	constructor(options: {
		clientId: string,
		guildId: string,
	}) {
		this.clientId = options.clientId
		this.guildId = options.guildId

		this.client = new Client({
			intents: [],
		})

		this.resolver = new Resolver(this.client)
	}

	public async login(token: string | undefined) {
		await this.client.login(token)
		this.setupListeners()
		await this.setupGuild()
		await this.resolver.resolve(this.guild as Guild)
		await this.setupCommands()
	}

	private async setupGuild() {
		this.guild = await this.client.guilds.fetch(this.guildId)
		
		logger.debug("Resolved guild")
	}

	private async setupCommands() {
		let files = await fs.readdir(path.resolve(__dirname, "commands"))
		files = files.filter(file => file.endsWith(".ts"))

		const data = [] as Object[]

		for (const file of files) {
			const command = (await import(`./commands/${file}`)).default as Command
			const builder = command.build()
			
			builder.setName(command.name)
			if (command.permissions) builder.setDefaultPermission(command.permissions.default)

			data.push(builder.toJSON())
			this.commands.set(command.name, command)
		}

		const rest = new REST({ version: "9" }).setToken(this.client.token as string)

		const response = await rest.put(
			Routes.applicationGuildCommands(this.clientId, this.guildId),
			{ body: data }
		) as BasicApplicationCommandData[]

		logger.debug("Registered commands")

		await Promise.all(
			response.map(async (commandData) => {
				const applicationCommand = await this.guild?.commands.fetch(commandData.id)
			
				if (applicationCommand) {
					const command = this.commands.get(applicationCommand.name)
					
					if (command?.permissions) {
						await applicationCommand.permissions.set({
							permissions: buildPermissions(command.permissions, this.resolver),
						})
					}
				}
			})
		)

		logger.debug("Set up command permissions")
	}

	private setupListeners() {
		this.client.on("interactionCreate", async (interaction) => {
			if (interaction.isCommand()) {
				const name = (interaction as CommandInteraction).commandName
				const command = this.commands.get(name)

				if (command) {
					await command.execute(interaction)
				} else {
					logger.warn(`Unknown command name: ${name}`)

					await interaction.reply({
						content: `**Internal Error**: Failed to find command \`${name}\` in collection`,
						ephemeral: true,
					})
				}
			}
		})

		logger.debug("Set up listeners")
	}
}

export default Bot