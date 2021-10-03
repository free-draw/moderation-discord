import API from "../../API"
import Action from "../Action"
import Resolvable from "./Resolvable"
import User from "../User"
import UserResolvable from "./UserResolvable"

class ActionResolvable extends Resolvable<Action> {
	public user: User | UserResolvable
	public id: string

	constructor(user: User | UserResolvable, id: string) {
		super()
		this.user = user
		this.id = id
	}

	public async resolve(api: API) {
		let user: User

		if (this.user instanceof User) {
			user = this.user
		} else {
			user = await this.user.resolve(api)
		}

		return user.actions.find(action => this.id === action.id) ?? null
	}
}

export default ActionResolvable