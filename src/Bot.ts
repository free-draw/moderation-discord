import fs from "fs/promises"
import path from "path"
import ICommand from "./interface/ICommand"
import { REST } from "@discordjs/rest"
import { Client, Collection, CommandInteraction, Guild } from "discord.js"
import { Routes } from "discord-api-types/v9"
import logger from "./Logger"

class Bot {
	public client: Client
	public commands: Collection<string, ICommand>
	public guild: Guild | undefined

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

		this.commands = new Collection()
	}

	public async login(token: string | undefined) {
		await this.client.login(token)
		this.setupListeners()
		await this.setupGuild()
		await this.setupCommands()
	}

	private async setupGuild() {
		this.guild = await this.client.guilds.fetch(this.guildId)
	}

	private async setupCommands() {
		let files = await fs.readdir(path.resolve(__dirname, "commands"))
		files = files.filter(file => file.endsWith(".ts"))

		const data: Array<Object> = []

		for (const file of files) {
			const command: ICommand = (await import(`./commands/${file}`)).default
			data.push(command.build().toJSON())
			this.commands.set(command.name, command)
		}

		const rest = new REST({ version: "9" }).setToken(this.client.token as string)
		await rest.put(
			Routes.applicationGuildCommands(this.clientId, this.guildId),
			{ body: data }
		)
	}

	private setupListeners() {
		this.client.on("interactionCreate", async (interaction) => {
			if (interaction.isCommand()) {
				const name = (interaction as CommandInteraction).commandName
				const command = this.commands.get(name)

				if (command) {
					if (command.defer) {
						await interaction.deferReply()
					}

					command.execute(interaction)
				} else {
					await interaction.reply({
						content: `**Internal Error**: Failed to find command \`${name}\` in collection`,
						ephemeral: true,
					})
				}
			}
		})
	}
}

export default Bot