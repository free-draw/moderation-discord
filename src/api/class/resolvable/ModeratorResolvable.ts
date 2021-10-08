import Resolvable from "./Resolvable"
import Moderator from "../Moderator"
import API from "../../API"

class ModeratorResolvable implements Resolvable<Moderator> {
	public id: string

	constructor(id: string) {
		this.id = id
	}

	public async resolve(api: API): Promise<Moderator | null> {

	}
}

export default ModeratorResolvable