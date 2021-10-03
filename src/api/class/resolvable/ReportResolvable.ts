import API from "../../API"
import Report from "../Report"
import Resolvable from "./Resolvable"

class ReportResolvable extends Resolvable<Report> {
	public id: string

	constructor(id: string) {
		super()
	}

	public async resolve(api: API) {

	}
}

export default ReportResolvable