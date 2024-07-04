import { Client, Guild } from "discord.js"
import log from "./util/log"
import CommandDispatcher from "./services/CommandDispatcher"
import Resolver from "./services/Resolver"
import EventEmitter from "events"
import Logger from "./services/Logger"

class Bot extends EventEmitter {
	public token: string
	public clientId: string
	public clientSecret: string
	public guildId: string
	public redisUrl?: string

	public client: Client
	public guild: Guild | undefined

	public resolver: Resolver
	public commandDispatcher: CommandDispatcher
	public logger?: Logger

	constructor(options: {
		token: string,
		clientId: string,
		clientSecret: string,
		guildId: string,
		redisUrl?: string,
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
		this.commandDispatcher = new CommandDispatcher(this)
		this.logger = new Logger(this)

		if (options.redisUrl) {
			this.logger.connect(options.redisUrl)
		} else {
			log.warn("Redis URL missing; disabling logger")
		}
	}

	public async login() {
		await this.client.login(this.token)

		log.debug("Resolving guild")
		this.guild = await this.client.guilds.fetch(this.guildId)

		this.emit("ready")
	}
}

export default Bot