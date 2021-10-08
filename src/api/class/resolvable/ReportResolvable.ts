import API from "../../API"
import Report from "../Report"
import Resolvable from "./Resolvable"

class ReportResolvable implements Resolvable<Report> {
	public id: string

	constructor(id: string) {
		this.id = id
	}

	public async resolve(api: API): Promise<Report | null> {

	}
}

export default ReportResolvable