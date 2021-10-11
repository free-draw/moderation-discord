import { Client, Guild } from "discord.js"
import log from "./util/log"
import Commands from "./services/Commands"
import Resolver from "./services/Resolver"
import EventEmitter from "events"
import Logger from "./services/Logger"

class Bot extends EventEmitter {
	public token: string
	public clientId: string
	public clientSecret: string
	public guildId: string
	public redisUrl: string

	public client: Client
	public guild: Guild | undefined

	public resolver: Resolver
	public commands: Commands
	public logger: Logger

	constructor(options: {
		token: string,
		clientId: string,
		clientSecret: string,
		guildId: string,
		redisUrl: string,
	}) {
		super()

		this.token = options.token
		this.clientId = options.clientId
		this.clientSecret = options.clientSecret
		this.guildId = options.guildId
		this.redisUrl = options.redisUrl

		this.client = new Client({
			intents: [],
		})

		this.resolver = new Resolver(this)
		this.commands = new Commands(this)
		this.logger = new Logger(this, options.redisUrl)
	}

	public async login() {
		await this.client.login(this.token)

		log.debug("Resolving guild")
		this.guild = await this.client.guilds.fetch(this.guildId)

		this.emit("ready")
	}
}

export default Bot