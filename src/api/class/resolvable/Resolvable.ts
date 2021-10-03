import API from "../../API"

abstract class Resolvable<T> {
	public abstract resolve(api: API): Promise<T | null>
}

export default Resolvable