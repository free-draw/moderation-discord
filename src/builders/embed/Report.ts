import { EmbedBuilder } from "discord.js"
import API from "../util/API"
import { Report, RobloxThumbnailType, getRobloxThumbnail, getRobloxUser } from "@free-draw/moderation-client"
import colors from "../util/resource/colors"

async function ReportEmbed(report: Report): Promise<EmbedBuilder> {
	const [ from, target ] = await Promise.all([
		getRobloxUser(API, report.from.id),
		getRobloxUser(API, report.target.id),
	])

	const avatar = await getRobloxThumbnail(API, {
		id: target.id,
		type: RobloxThumbnailType.AVATAR_HEADSHOT,
		size: "150x150",
	})

	return new EmbedBuilder()
		.setTitle(`${from.name} → ${target.name}`)
		.setDescription(report.reason)
		.setFields([
			{
				name: "Notes",
				value: report.notes && report.notes.length > 0 ? report.notes : "*No notes specified*",
			},
		])
		.setThumbnail(avatar)
		.setFooter({ text: `Status: ${report.status} | ID: ${report.id}` })
		.setColor(colors.brand)
		.setTimestamp(new Date())
}

export default ReportEmbed