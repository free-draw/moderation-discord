import { Client, Collection, Guild, GuildChannel, Role } from "discord.js"
import config from "./util/config"
import logger from "./util/logger"

class Resolver {
	public client: Client
	public guild: Guild | undefined

	private channels: Collection<string, GuildChannel> = new Collection()
	private roles: Collection<string, Role> = new Collection()

	constructor(client: Client) {
		this.client = client
	}

	private errorIfNotInitialized(): void | never {
		if (!this.guild) throw new Error("Guild is not yet initialized")
	}

	public getChannel(name: string): GuildChannel {
		this.errorIfNotInitialized()
		const channel = this.channels.get(name)
		if (!channel) throw new Error(`Channel "${name}" is not defined`)
		return channel
	}

	public getRole(name: string): Role {
		this.errorIfNotInitialized()
		const role = this.roles.get(name)
		if (!role) throw new Error(`Channel "${name}" is not defined`)
		return role
	}

	public async resolve(guild: Guild): Promise<void> {
		this.guild = guild

		await Promise.all([
			...Object.entries(config.channels).map(async ([ name, id ]) => {
				const channel = await guild.channels.fetch(id)
				if (!channel) throw new Error(`Unable to find channel with id ${id}`)
				this.channels.set(id, channel as unknown as GuildChannel)
				logger.debug(`Resolved channel "${name}" to ID ${id} (#${channel.name})`)
			}),

			...Object.entries(config.roles).map(async ([ name, id ]) => {
				const role = await guild.roles.fetch(id)
				if (!role) throw new Error(`Unable to find role with id ${id}`)
				this.roles.set(name, role)
				logger.debug(`Resolved role "${name}" to ID ${id} (@${role.name})`)
			}),
		])

		logger.debug("Successfully resolved all roles and channels")
	}
}

export default Resolver