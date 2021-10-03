import ActionType from "../enum/ActionType"
//import ModeratorResolvable from "./resolvable/ModeratorResolvable"
//import ReportResolvable from "./resolvable/ReportResolvable"
//import SnapshotResolvable from "./resolvable/SnapshotResolvable"

type ActionData = {
	id: string,
	active: boolean,
	type: ActionType,
	data: any,
	expiry?: string,
	moderator?: string,

	reason: string,
	notes: string,
	snapshot: string,
	report: string,

	timestamp: string,
}

class Action {
	public id: string
	public active: boolean
	public type: ActionType
	public data: any
	public expiry: Date | null
	//public moderator: ModeratorResolvable | null

	public reason: string
	public notes: string
	//public snapshot: SnapshotResolvable
	//public report: ReportResolvable

	public timestamp: Date

	constructor(data: ActionData, active: boolean) {
		this.id = data.id
		this.active = active
		this.type = data.type
		this.data = data.data
		this.expiry = data.expiry ? new Date(data.expiry) : null
		//this.moderator = data.moderator ? new ModeratorResolvable(data.moderator) : null

		this.reason = data.reason
		this.notes = data.notes
		//this.snapshot = new SnapshotResolvable(data.snapshot)
		//this.report = new ReportResolvable(data.report)

		this.timestamp = new Date(data.timestamp)
	}

	public async deactivate() {
		// TODO
	}
}

export default Action
export { Action, ActionData }