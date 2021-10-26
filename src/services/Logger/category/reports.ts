import { MessageActionRow, MessageButton } from "discord.js"
import Report, { ReportData } from "../../../api/class/Report"
import ReportEmbed from "../../../embed/Report"
import link from "../../../util/resource/link"
import LoggerCategory from "../LoggerCategory"

type ReportCreateEvent = {
	report: ReportData,
}

export default {
	channel: "reports",
	events: {
		async reportCreate(data: ReportCreateEvent) {
			const report = new Report(data.report)
			const embed = await ReportEmbed(report)

			return {
				embeds: [ embed ],
				components: [
					new MessageActionRow({
						components: [
							new MessageButton({
								label: "View on Moderation Panel",
								style: "LINK",
								url: link.moderation.report(report.id),
							})
						],
					})
				],
			}
		},
	},
} as LoggerCategory