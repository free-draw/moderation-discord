import Bot from "./Bot"
import log from "./util/log"

(async () => {
	const bot: Bot = new Bot({
		clientId: process.env.CLIENT_ID as string,
		guildId: process.env.GUILD_ID as string,
	})

	log.info("Logging in...")
	await bot.login(process.env.TOKEN as string)
	log.info(`Logged in as ${bot.client.user?.username}`)
})()