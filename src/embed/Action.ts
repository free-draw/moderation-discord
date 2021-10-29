import { MessageEmbed } from "discord.js"
import Action from "../api/class/Action"
import colors from "../util/resource/colors"

async function ActionEmbed(action: Action): Promise<MessageEmbed> {
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

	return new MessageEmbed({
		title: `${action.type} ${!action.active ? "(inactive)" : ""}`,
		description: action.reason,
		fields,
		timestamp: action.created,
		color: action.active ? colors.actionActive : colors.actionInactive,
	})
}

export default ActionEmbed