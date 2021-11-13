import { getRobloxUser, Log, LogData, LogType, LogTypeData, Moderator } from "@free-draw/moderation-client"
import API from "../../../util/API"
import LoggerCategory from "../LoggerCategory"
import { MessageOptions, ColorResolvable } from "discord.js"
import ActionEmbed from "../../../embed/Action"
import ModeratorEmbed from "../../../embed/Moderator"
import ModeratorAccountEmbed from "../../../embed/ModeratorAccount"
import ReportEmbed from "../../../embed/Report"
import colors from "../../../util/resource/colors"

const messages = {
	[LogType.CREATE_ACTION]: async (data: LogTypeData[LogType.CREATE_ACTION], moderator: Moderator) => {
		return {
			content: `**${moderator.name}** created an action on **${data.user.name}** (${data.user.id})`,
			embeds: [
				(await ActionEmbed(data.action)).setColor(colors.create),
			],
		}
	},
	[LogType.DELETE_ACTION]: async (data: LogTypeData[LogType.DELETE_ACTION], moderator: Moderator) => {
		return {
			content: `**${moderator.name}** deleted an action on **${data.user.name}** (${data.user.id})`,
			embeds: [
				(await ActionEmbed(data.action)).setColor(colors.delete),
			],
		}
	},
	[LogType.DELETE_ACTIONS_BULK]: async (data: LogTypeData[LogType.DELETE_ACTIONS_BULK], moderator: Moderator) => {
		return {
			content: `**${moderator.name}** deleted ${data.actions.length} action(s) on **${data.user.name}** (${data.user.id})`,
			embeds: (await Promise.all(data.actions.map(ActionEmbed))).map(embed => embed.setColor(colors.delete)),
		}
	},

	[LogType.CREATE_MODERATOR]: async (data: LogTypeData[LogType.CREATE_MODERATOR], moderator: Moderator) => {
		return {
			content: `**${moderator.name}** created ${data.moderator.name} (${data.moderator.id})`,
			embeds: [
				(await ModeratorEmbed(data.moderator)).setColor(colors.create),
			],
		}
	},
	[LogType.DELETE_MODERATOR]: async (data: LogTypeData[LogType.DELETE_MODERATOR], moderator: Moderator) => {
		return {
			content: `**${moderator.name}** deleted ${data.moderator.name} (${data.moderator.id})`,
			embeds: [
				(await ModeratorEmbed(data.moderator)).setColor(colors.delete),
			],
		}
	},
	[LogType.UPDATE_MODERATOR]: async (data: LogTypeData[LogType.UPDATE_MODERATOR], moderator: Moderator) => {
		return {
			content: `**${moderator.name}** updated ${data.moderator.name} (${data.moderator.id})`,
			embeds: [
				(await ModeratorEmbed(data.moderator)).setColor(colors.modify),
			],
		}
	},
	[LogType.LINK_MODERATOR_ACCOUNT]: async (data: LogTypeData[LogType.LINK_MODERATOR_ACCOUNT], moderator: Moderator) => {
		return {
			content: `**${moderator.name}** linked a moderator account (${data.moderator.id})`,
			embeds: [
				(await ModeratorAccountEmbed(data.account)).setColor(colors.create),
			],
		}
	},
	[LogType.UNLINK_MODERATOR_ACCOUNT]: async (data: LogTypeData[LogType.UNLINK_MODERATOR_ACCOUNT], moderator: Moderator) => {
		return {
			content: `**${moderator.name}** unlinked a moderator account (${data.moderator.id})`,
			embeds: [
				(await ModeratorAccountEmbed(data.account)).setColor(colors.delete),
			],
		}
	},

	[LogType.ACCEPT_REPORT]: async (data: LogTypeData[LogType.ACCEPT_REPORT], moderator: Moderator) => {
		const [ target, from ] = await Promise.all([
			getRobloxUser(API, data.report.target.id),
			getRobloxUser(API, data.report.from.id),
		])

		return {
			content: `**${moderator.name}** accepted a report on **${target.name}** (${target.id}) from **${from.name}** (${from.id})`,
			embeds: [
				(await ReportEmbed(data.report)).setColor(colors.accept),
				(await ActionEmbed(data.action)).setColor(colors.accept),
			],
		}
	},
	[LogType.DECLINE_REPORT]: async (data: LogTypeData[LogType.DECLINE_REPORT], moderator: Moderator) => {
		console.log(data.report.target.id, data.report.from.id)
		const [ target, from ] = await Promise.all([
			getRobloxUser(API, data.report.target.id),
			getRobloxUser(API, data.report.from.id),
		])

		return {
			content: `**${moderator.name}** declined a report on **${target.name}** (${target.id}) from **${from.name}** (${from.id})`,
			embeds: [
				(await ReportEmbed(data.report)).setColor(colors.decline),
			],
		}
	},
} as Record<LogType, (data: LogTypeData[LogType], moderator: Moderator) => Promise<MessageOptions>>

export default {
	channel: "logs",
	events: {
		async log(data: LogData) {
			const log = new Log(data)

			const [ resolvedData, resolvedModerator ] = await Promise.all([
				log.resolveData(API),
				log.moderator.resolve(API),
			])

			return messages[log.type](resolvedData, resolvedModerator)
		},
	},
} as LoggerCategory