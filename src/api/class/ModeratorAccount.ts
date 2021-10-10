import IdentityType from "../enum/IdentityType"

type ModeratorAccountData = {
	type: IdentityType,
	id: string | number,
}

class ModeratorAccount {
	public type: IdentityType
	public id: string | number

	constructor(data: ModeratorAccountData) {
		this.type = data.type
		this.id = data.id
	}
}

export default ModeratorAccount
export { ModeratorAccount, ModeratorAccountData }