import { Embed } from "discord.js"
import { Action } from "@free-draw/moderation-client"
import colors from "../util/resource/colors"

async function ActionEmbed(action: Action): Promise<Embed> {
	const fields = [
		{
			name: "Notes",
			value: action.notes && action.notes.length > 0 ? action.notes : "*No notes specified*",
		},
	] as { name: string, value: string, inline?: boolean }[]

	if (action.expiry) {
		fields.push({
			name: "Expiry",
			value: action.expiry.toString(),
		})
	}

	return new Embed({
		title: `${action.type} ${!action.active ? "(inactive)" : ""}`,
		description: action.reason,
		fields,
		timestamp: action.created,
		footer: { text: `ID: ${action.id}` },
		color: action.active ? colors.actionActive : colors.actionInactive,
	})
}

export default ActionEmbed