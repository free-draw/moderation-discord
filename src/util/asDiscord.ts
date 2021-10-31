import { AccountPlatform, API } from "@free-draw/moderation-client"
import { User } from "discord.js"

function asDiscord(api: API, user: User): API {
	return api.as({
		platform: AccountPlatform.DISCORD,
		id: user.id,
	})
}

export default asDiscord