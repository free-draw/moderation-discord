import IdentityType from "../../enum/IdentityType"
import ModeratorAccount from "../ModeratorAccount"
import Resolvable from "./Resolvable"

class ModeratorAccountResolvable extends Resolvable<ModeratorAccount> {
	public type: IdentityType
	public id: string | number

	constructor(type: IdentityType, id: string | number) {
		super()
		this.type = type
		this.id = id
	}

	public async resolve() {
		
	}
}

export default ModeratorAccountResolvable