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
	public from: UserResolvable
	public target: UserResolvable
	public status: ReportStatus

	public reason: string
	public notes: string
	public snapshot: SnapshotResolvable

	constructor(data: ReportData) {
		this.from = new UserResolvable(data.fromUserId)
		this.target = new UserResolvable(data.targetUserId)
		this.status = data.result // TODO: Switch this over

		this.reason = data.reason
		this.notes = data.notes
		this.snapshot = new SnapshotResolvable(data.snapshot)
	}

	public async accept() {
		// TODO
	}

	public async decline() {
		// TODO
	}
}

export default Report
export { Report, ReportData }