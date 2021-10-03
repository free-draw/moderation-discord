import API from "../../API"
import Resource from "../../Resource"

type RobloxUser = {
	id: number,
	name: string,
	displayName: string,
	requestedUsername: string,
}

type GetRobloxUsernamesRequest = {
	usernames: string[],
	excludeBannedUsers?: boolean,
}

type GetRobloxUsernamesResponse = {
	data: RobloxUser[],
}

const RobloxUsernameResource = new Resource<string, RobloxUser, API>(async (requestedUsernames, api) => {
	const response = await api.request({
		url: "/roblox/usernames",
		method: "POST",
		data: {
			usernames: Object.values(requestedUsernames),
		} as GetRobloxUsernamesRequest,
	})
	const data = response.data as GetRobloxUsernamesResponse

	const users = {} as { [key: string]: RobloxUser }
	for (const user of data.data) {
		users[user.requestedUsername] = user
	}
	return users
})

function getRobloxUsername(api: API, username: string) {
	username = username.toLowerCase()
	return RobloxUsernameResource.request(api, username, username)
}

export default getRobloxUsername