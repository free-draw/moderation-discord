import { TextChannel, Collection, MessageOptions } from "discord.js"
import IORedis from "ioredis"
import { resolve } from "path"
import Bot from "../../Bot"
import Service from "../../types/interface/Service"
import bulkImport from "../../util/bulkImport"
import log from "../../util/log"
import LoggerCategory from "./LoggerCategory"

type LoggerQueuedMessage = {
	channelName: string,
	message: MessageOptions,
}

class Logger implements Service {
	public bot: Bot
	public subscriber: IORedis.Redis

	private targets: Collection<string, LoggerCategory> = new Collection()
	private queue: LoggerQueuedMessage[] = []

	constructor(bot: Bot, redisUrl: string) {
		this.bot = bot
		this.subscriber = new IORedis(redisUrl)

		this.bot.resolver.on("resolve", async () => {
			for (const queueItem of this.queue) {
				await this.send(queueItem.channelName, queueItem.message)
			}

			this.queue = []
		})

		this.loadCategories().then(() => {
			const events = [ ...this.targets.keys() ]
			this.subscriber.subscribe(...events)
			log.debug(`Subscribed to Redis events: ${events.join(",")}`)
		})

		this.subscriber.connect(() => {
			log.info("Connected to Redis")
		})

		this.subscriber.on("message", (eventName: string, data: string) => {
			this.log(eventName, JSON.parse(data))
		})
	}

	private async loadCategories(): Promise<void> {
		const directory = resolve(__dirname, "category")
		const categories = await bulkImport<LoggerCategory>(directory, true)

		for (const [ _, category ] of categories) {
			for (const eventName in category.events) {
				this.targets.set(eventName, category)
			}
		}
	}

	private async send(channelName: string, message: MessageOptions): Promise<boolean> {
		const resolver = this.bot.resolver

		if (resolver.resolved) {
			const channel = resolver.channels.get(channelName) as TextChannel | undefined
			if (!channel) throw new Error(`Unknown channel "${channelName}"`)
			channel.send(message)

			return true
		} else {
			log.debug(`Queued logger event to ${channelName}`)
			this.queue.push({ channelName, message })
			return false
		}
	}

	private async log(eventName: string, data: any): Promise<boolean> {
		const target = this.targets.get(eventName)

		if (target) {
			log.debug(`Pushing logger event ${eventName}`)
			const message = await target.events[eventName](data)
			return await this.send(target.channel, message)
		} else {
			log.warn(`Unknown target for event "${eventName}"`)
		}

		return false
	}
}

export default Logger