import { API } from "@free-draw/moderation-client"

export default new API(
	process.env.API_URL as string,
	process.env.API_TOKEN as string
)