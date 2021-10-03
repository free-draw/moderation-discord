import { Action, ActionData } from "./Action"

type UserData = {
	userId: number,
	actions: ActionData[],
	history: ActionData[],
}

class User {
	public id: number
	public actions: Action[]
	public history: Action[]

	constructor(data: UserData) {
		this.id = data.userId
		this.actions = data.actions.map(actionData => new Action(actionData, true))
		this.history = data.history.map(actionData => new Action(actionData, false))
	}
}

export default User
export { User, UserData }