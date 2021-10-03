import API from "../../API"
import { User, UserData } from "../../class/User"

type GetUserResponse = {
	user: UserData,
}

async function getUser(api: API, id: number): Promise<User> {
	const response = await api.request({
		url: `/users/${id}`,
		method: "GET",
	})
	const data = response.data as GetUserResponse

	return new User(data.user)
}

export default getUser