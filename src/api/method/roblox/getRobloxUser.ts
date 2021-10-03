import API from "../../API"
import Resource from "../../Resource"

type RobloxUser = {
	id: number,
	name: string,
	displayName: string,
}

type GetRobloxUsersRequest = {
	userIds: number[],
	excludeBannedUsers?: boolean,
}

type GetRobloxUsersResponse = {
	data: RobloxUser[],
}

const RobloxUserResource = new Resource<number, RobloxUser, API>(async (requestedUsers, api) => {
	const response = await api.request({
		url: "/roblox/users",
		method: "POST",
		data: {
			userIds: Object.values(requestedUsers),
		} as GetRobloxUsersRequest,
	})
	const data = response.data as GetRobloxUsersResponse

	const users = {} as { [key: string]: RobloxUser }
	for (const user of data.data) {
		users[user.id.toString()] = user
	}
	return users
})

function getRobloxUser(api: API, id: number): Promise<RobloxUser> {
	return RobloxUserResource.request(api, id, id.toString())
}

export default getRobloxUser