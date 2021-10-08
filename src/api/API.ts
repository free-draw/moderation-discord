import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { User } from "discord.js"
import { URL } from "url"
import { ModeratorAccountData } from "./class/ModeratorAccount"
import IdentityType from "./enum/IdentityType"
import urljoin from "url-join"

class API {
	public url: string
	public token: string
	public identity?: ModeratorAccountData

	constructor(url: string, token: string, identity?: ModeratorAccountData) {
		this.url = url
		this.token = token
		this.identity = identity
	}

	public async request(config: AxiosRequestConfig): Promise<AxiosResponse> {
		const url = new URL(urljoin(this.url, config.url as string))

		if (this.identity) {
			url.searchParams.set("identity", `${this.identity.type}/${this.identity.id}`)
		}

		return await axios({
			...config,

			url: url.toString(),
			headers: {
				...(config.headers ?? {}),
				authorization: `Bearer ${this.token}`,
			},
		})
	}

	public as(identity: ModeratorAccountData): API {
		return new API(this.url, this.token, identity)
	}

	public asDiscord(user: User): API {
		return this.as({
			type: IdentityType.DISCORD,
			id: user.id,
		})
	}
}

export default API