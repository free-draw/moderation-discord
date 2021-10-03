import API from "../../API"
import { User, UserData } from "../../class/User"

type GetUsersBulkRequest = number[]

type GetUsersBulkResponse = {
	users: UserData[],
}

async function getUsersBulk(api: API, userIds: number[]): Promise<User[]> {
	const response = await api.request({
		url: "/users",
		method: "POST",
		data: userIds as GetUsersBulkRequest,
	})
	const data = response.data as GetUsersBulkResponse
	
	return data.users.map((userData) => new User(userData))
}

export default getUsersBulk