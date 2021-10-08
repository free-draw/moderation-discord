import Bot from "./Bot"
import env from "./util/env"
import log from "./util/log"

(async () => {
	const bot: Bot = new Bot({
		token: env.token,
		clientId: env.clientId,
		clientSecret: env.clientSecret,
		guildId: env.guildId,
	})

	log.info("Logging in...")
	await bot.login()
	log.info(`Logged in as ${bot.client.user?.username}`)
})()