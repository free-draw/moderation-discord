import { Client, Collection, Guild, GuildChannel } from "discord.js"
import config from "./util/config"
import logger from "./util/logger"

class Resolver {
	public client: Client
	public guild: Guild | undefined

	private channels: Collection<string, GuildChannel> = new Collection()

	constructor(client: Client) {
		this.client = client
	}

	public get(name: string): GuildChannel {
		if (!this.guild) throw new Error("Guild is not yet initialized")
		const channel = this.channels.get(name)
		if (channel === undefined) throw new Error(`Channel "${name}" is not defined`)
		return channel
	}

	public async resolve(guild: Guild): Promise<void> {
		await Promise.all(
			Object.entries(config.channels).map(async ([ name, id ]) => {
				const channel = await guild.channels.fetch(id)
				if (channel === null) {
					throw new Error(`Unable to find channel with id ${id}`)
				}

				this.channels.set(id, channel as unknown as GuildChannel)

				logger.debug(`Resolved channel "${name}" to ID ${id} (#${channel.name})`)
			})
		)

		logger.debug("Resolved all channels")

		this.guild = guild
	}
}

export default Resolver