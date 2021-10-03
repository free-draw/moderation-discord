import { ModeratorAccount, ModeratorAccountData } from "./ModeratorAccount"

type ModeratorData = {
	id: string,
	name: string,
	enabled: boolean,
	accounts: ModeratorAccountData[],
	permissions: string[],
}

class Moderator {
	construtor(data: ModeratorData) {
		
	}
}

export default Moderator
export { Moderator, ModeratorData }