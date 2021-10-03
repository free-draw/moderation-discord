export default {
	roblox: {
		profile(id: number) { return `https://www.roblox.com/users/${id}/profile` },
	},

	moderation: {
		user(id: number) { return `https://moderation.freedraw.app/users/${id}` },
	},
}