import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
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
					new ActionRowBuilder<ButtonBuilder>()
						.addComponents(
							new ButtonBuilder()
								.setLabel("View on Moderation Panel")
								.setStyle(ButtonStyle.Link)
								.setURL(link.moderation.report(report.id))
						)
				],
			}
		},
	},
} as LoggerCategory