import { AxiosResponse } from "axios"
import API from "../../API"
import { User, UserData } from "../../class/User"

type GetUserResponse = {
	user: UserData,
}

async function getUser(api: API, id: number): Promise<User> {
	const { data } = await api.request({
		url: `/users/${id}`,
		method: "GET",
	}) as AxiosResponse<GetUserResponse>

	return new User(data.user)
}

export default getUser