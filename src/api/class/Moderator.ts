import API from "../API"
import { ModeratorAccount, ModeratorAccountData } from "./ModeratorAccount"

type ModeratorData = {
	id: string,
	name: string,
	enabled: boolean,
	accounts: ModeratorAccountData[],
	permissions: string[],
}

class Moderator {
	public id: string
	public name: string
	public enabled: boolean
	public accounts: ModeratorAccount[]
	public permissions: string[]

	constructor(data: ModeratorData) {
		this.id = data.id
		this.name = data.name
		this.enabled = data.enabled
		this.accounts = data.accounts.map(accountData => new ModeratorAccount(accountData))
		this.permissions = data.permissions
	}

	public async linkAccount(account: ModeratorAccount | ModeratorAccountData) {
		// TODO
	}

	public async unlinkAccount(account: ModeratorAccount | ModeratorAccountData) {
		// TODO
	}

	public async delete(api: API) {
		// TODO
	}
}

export default Moderator
export { Moderator, ModeratorData }