import ReportStatus from "../enum/ReportStatus"
import SnapshotResolvable from "./resolvable/SnapshotResolvable"
import UserResolvable from "./resolvable/UserResolvable"

type ReportData = {
	id: string,
	result: ReportStatus,
	targetUserId: number,
	fromUserId: number,
	reason: string,
	notes: string,
	snapshot: string,
}

class Report {
	public id: string
	public status: ReportStatus
	public from: UserResolvable
	public target: UserResolvable

	public reason: string
	public notes: string
	public snapshot: SnapshotResolvable

	constructor(data: ReportData) {
		this.id = data.id
		this.status = data.result // TODO: Result -> status
		this.from = new UserResolvable(data.fromUserId)
		this.target = new UserResolvable(data.targetUserId)

		this.reason = data.reason
		this.notes = data.notes
		this.snapshot = new SnapshotResolvable(data.snapshot)
	}

	public async accept(): Promise<void> {
		// TODO
	}

	public async decline(): Promise<void> {
		// TODO
	}
}

export default Report
export { Report, ReportData }