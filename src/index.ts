import Bot from "./Bot"
import env from "./util/env"
import log from "./util/log"

(async () => {
	log.debug("Initializing")

	const bot: Bot = new Bot({
		token: env.token,
		clientId: env.clientId,
		clientSecret: env.clientSecret,
		guildId: env.guildId,
		redisUrl: env.redisUrl,
	})

	await bot.login()

	log.info(`Connected to Discord: ${bot.client.user?.username}`)
})()