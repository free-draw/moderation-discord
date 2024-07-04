import { EmbedBuilder } from "discord.js"
import { Action } from "@free-draw/moderation-client"
import colors from "../../util/resource/colors"

async function ActionEmbed(action: Action): Promise<EmbedBuilder> {
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

	return new EmbedBuilder()
		.setTitle(`${action.type} ${!action.active ? "(inactive)" : ""}`)
		.setDescription(action.reason)
		.setFields(fields)
		.setTimestamp(action.created)
		.setFooter({ text: `ID: ${action.id}` })
		.setColor(action.active ? colors.actionActive : colors.actionInactive)
}

export default ActionEmbed