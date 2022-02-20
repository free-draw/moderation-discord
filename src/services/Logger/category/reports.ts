import { ActionRow, ButtonComponent, ButtonStyle } from "discord.js"
import { Report, ReportData } from "@free-draw/moderation-client"
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
					new ActionRow({
						components: [
							new ButtonComponent({
								label: "View on Moderation Panel",
								style: ButtonStyle.Link,
								url: link.moderation.report(report.id),
							})
						],
					})
				],
			}
		},
	},
} as LoggerCategory