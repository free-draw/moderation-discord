import EventEmitter from "events"
import Bot from "../Bot"
import { Collection, GuildChannel, Role } from "discord.js"
import config from "../util/option/config"
import log from "../util/log"
import Service from "../interface/Service"

type ResolverRoles = Collection<string, Role>
type ResolverChannels = Collection<string, GuildChannel>

interface Resolver {
	on(event: "resolve", listener: (roles: ResolverRoles, channels: ResolverChannels) => void): this,
	on(event: string, listener: () => void): this,
}

class Resolver extends EventEmitter implements Service {
	public bot: Bot
	public resolved: boolean = false
	public roles: ResolverRoles = new Collection()
	public channels: ResolverChannels = new Collection()

	constructor(bot: Bot) {
		super()

		this.bot = bot

		this.bot.client.on("ready", async () => {
			await Promise.all([
				this.resolveRoles(),
				this.resolveChannels(),
			])

			this.resolved = true
			this.emit("resolve", this.roles, this.channels)
		})
	}

	private async resolveRoles(): Promise<void> {
		log.debug("Resolving roles")

		await Promise.all(
			Object.entries(config.roles).map(async ([ name, id ]) => {
				if (!this.bot.guild) throw new Error("Guild is undefined")

				const role = await this.bot.guild.roles.fetch(id)
				if (!role) throw new Error(`Unable to find role with id ${id}`)

				this.roles.set(name, role)

				log.debug(`Resolved role "${name}" to ${id} (${role.name})`)
			})
		)
	}

	private async resolveChannels(): Promise<void> {
		log.debug("Resolving channels")

		await Promise.all(
			Object.entries(config.channels).map(async ([ name, id ]) => {
				if (!this.bot.guild) throw new Error("Guild is undefined")

				const channel = await this.bot.guild.channels.fetch(id)
				if (!channel) throw new Error(`Unable to find channel with id ${id}`)

				this.channels.set(name, channel)

				log.debug(`Resolved channel "${name}" to ${id} (${channel.name})`)
			})
		)
	}
}

export default Resolver
export { ResolverRoles, ResolverChannels }