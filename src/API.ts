import API from "./api/API"

export default new API(
	process.env.API_URL as string,
	process.env.API_TOKEN as string
)