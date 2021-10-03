import API from "../../API"
import Resolvable from "./Resolvable"
import Snapshot from "../Snapshot"

class SnapshotResolvable extends Resolvable<Snapshot> {
	public id: string

	constructor(id: string) {
		super()
		this.id = id
	}

	public async resolve(api: API) {
		
	}
}

export default SnapshotResolvable