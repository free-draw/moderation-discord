import API from "../../API"
import Report from "../Report"
import Resolvable from "./Resolvable"

class ReportResolvable implements Resolvable<Report> {
	public id: string

	constructor(id: string) {
		this.id = id
	}

	public async resolve(api: API) {

	}
}

export default ReportResolvable