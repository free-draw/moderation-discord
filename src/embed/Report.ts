import { MessageEmbed } from "discord.js"
import API from "../util/API"
import { Report, RobloxThumbnailType, getRobloxThumbnail, getRobloxUser } from "@free-draw/moderation-client"
import colors from "../util/resource/colors"

async function ReportEmbed(report: Report): Promise<MessageEmbed> {
	const [ from, target ] = await Promise.all([
		getRobloxUser(API, report.from.id),
		getRobloxUser(API, report.target.id),
	])

	const avatar = await getRobloxThumbnail(API, {
		id: target.id,
		type: RobloxThumbnailType.AVATAR_HEADSHOT,
		size: "150x150",
	})

	return new MessageEmbed({
		title: `${from.name} → ${target.name}`,
		description: report.reason,
		fields: [
			{
				name: "Notes",
				value: report.notes && report.notes.length > 0 ? report.notes : "*No notes specified*",
			},
		],
		thumbnail: { url: avatar },
		footer: { text: `Status: ${report.status}` },
		color: colors.brand,
		timestamp: new Date(),
	})
}

export default ReportEmbed