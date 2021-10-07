import Bot from "./Bot"
import log from "./util/log"

(async () => {
	const bot: Bot = new Bot({
		token: process.env.TOKEN as string,
		clientId: process.env.CLIENT_ID as string,
		clientSecret: process.env.CLIENT_SECRET as string,
		guildId: process.env.GUILD_ID as string,
	})

	log.info("Logging in...")
	await bot.login()
	log.info(`Logged in as ${bot.client.user?.username}`)
})()