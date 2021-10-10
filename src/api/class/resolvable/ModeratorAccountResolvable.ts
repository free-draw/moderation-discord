import API from "../../API"
import IdentityType from "../../enum/IdentityType"
import getModerator from "../../method/moderators/getModerator"
import ModeratorAccount from "../ModeratorAccount"
import Resolvable from "./Resolvable"

class ModeratorAccountResolvable implements Resolvable<ModeratorAccount> {
	public type: IdentityType
	public id: string | number

	constructor(type: IdentityType, id: string | number) {
		this.type = type
		this.id = id
	}

	public async resolve(api: API): Promise<ModeratorAccount | null> {
		const moderator = await getModerator(api, {
			type: this.type,
			id: this.id,
		})

		return moderator?.accounts.find(account => account.type === this.type && account.id === this.id) ?? null
	}
}

export default ModeratorAccountResolvable