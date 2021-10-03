import Resolvable from "./Resolvable"
import Moderator from "../Moderator"
import API from "../../API"

class ModeratorResolvable extends Resolvable<Moderator> {
	public id: string

	constructor(id: string) {
		super()
		this.id = id
	}

	public async resolve(api: API) {
		
	}
}

export default ModeratorResolvable