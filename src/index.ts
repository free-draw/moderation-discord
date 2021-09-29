import Bot from "./Bot"
import logger from "./util/logger"

async function init(): Promise<Bot> {
	const bot: Bot = new Bot({
		clientId: process.env.CLIENT_ID as string,
		guildId: process.env.GUILD_ID as string,
	})
	await bot.login(process.env.TOKEN as string)
	return bot
}

init().then((bot) => {
	logger.info(`Logged in as ${bot.client.user?.username}`)
}, (error) => {
	throw error
})