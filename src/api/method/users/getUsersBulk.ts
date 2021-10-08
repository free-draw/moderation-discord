import { AxiosResponse } from "axios"
import API from "../../API"
import { User, UserData } from "../../class/User"

type GetUsersBulkRequest = number[]

type GetUsersBulkResponse = {
	users: UserData[],
}

async function getUsersBulk(api: API, userIds: number[]): Promise<User[]> {
	const { data } = await api.request({
		url: "/users",
		method: "POST",
		data: userIds as GetUsersBulkRequest,
	}) as AxiosResponse<GetUsersBulkResponse>

	return data.users.map((userData) => new User(userData))
}

export default getUsersBulk