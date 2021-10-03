import IdentityType from "../enum/IdentityType"

type ModeratorAccountData = {
	type: IdentityType,
	id: string | number,
}

class ModeratorAccount {
	constructor(data: ModeratorAccountData) {

	}

	public async delete() {
		// TODO
	}
}

export default ModeratorAccount
export { ModeratorAccount, ModeratorAccountData }