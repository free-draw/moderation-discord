import { Client, Guild } from "discord.js"
import log from "./util/log"
import Commands from "./services/Commands"
import Resolver from "./services/Resolver"
import EventEmitter from "events"

class Bot extends EventEmitter {
	public token: string
	public clientId: string
	public clientSecret: string
	public guildId: string

	public client: Client
	public guild: Guild | undefined

	public resolver: Resolver
	public commands: Commands

	constructor(options: {
		token: string,
		clientId: string,
		clientSecret: string,
		guildId: string,
	}) {
		super()

		this.token = options.token
		this.clientId = options.clientId
		this.clientSecret = options.clientSecret
		this.guildId = options.guildId

		this.client = new Client({
			intents: [],
		})

		this.resolver = new Resolver(this)
		this.commands = new Commands(this)
	}

	public async login() {
		await this.client.login(this.token)

		log.debug("Resolving guild")
		this.guild = await this.client.guilds.fetch(this.guildId)

		this.emit("ready")
	}
}

export default Bot