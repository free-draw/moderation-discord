import Bot from "./Bot"
import env from "./util/option/env"
import log from "./util/log"
import config from "./util/option/config"

(async () => {
	log.debug("Initializing")

	const bot: Bot = new Bot({
		token: env.discordToken,
		clientId: env.discordClientId,
		clientSecret: env.discordClientSecret,
		guildId: config.guild,
		redisUrl: env.redisUrl,
	})

	await bot.login()

	log.info(`Connected to Discord: ${bot.client.user?.username}`)
})()