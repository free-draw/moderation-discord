import { Log, LogData, LogType, LogTypeData, Moderator } from "@free-draw/moderation-client"
import API from "../../../util/API"
import LoggerCategory from "../LoggerCategory"
import { MessageCreateOptions } from "discord.js"
import ActionEmbed from "../../../embed/Action"
import ModeratorEmbed from "../../../embed/Moderator"
import ModeratorAccountEmbed from "../../../embed/ModeratorAccount"
import ReportEmbed from "../../../embed/Report"
import colors from "../../../util/resource/colors"

type LogMessageGenerator<T extends LogType> = (data: LogTypeData[T], moderator: Moderator) => Promise<MessageCreateOptions>

const messages = {
	[LogType.CREATE_ACTION]: async (data, moderator) => {
		return {
			content: `**${moderator.name}** created an action on **${data.user.name}** (${data.user.id})`,
			embeds: [
				(await ActionEmbed(data.action)).setColor(colors.create),
			],
		}
	},
	[LogType.DELETE_ACTION]: async (data, moderator) => {
		return {
			content: `**${moderator.name}** deleted an action on **${data.user.name}** (${data.user.id})`,
			embeds: [
				(await ActionEmbed(data.action)).setColor(colors.delete),
			],
		}
	},
	[LogType.DELETE_ACTIONS_BULK]: async (data, moderator) => {
		return {
			content: `**${moderator.name}** deleted ${data.actions.length} action(s) on **${data.user.name}** (${data.user.id})`,
			embeds: (await Promise.all(data.actions.map(ActionEmbed))).map(embed => embed.setColor(colors.delete)),
		}
	},

	[LogType.CREATE_MODERATOR]: async (data, moderator) => {
		return {
			content: `**${moderator.name}** created ${data.moderator.name} (${data.moderator.id})`,
			embeds: [
				(await ModeratorEmbed(data.moderator)).setColor(colors.create),
			],
		}
	},
	[LogType.DELETE_MODERATOR]: async (data, moderator) => {
		return {
			content: `**${moderator.name}** deleted ${data.moderator.name} (${data.moderator.id})`,
			embeds: [
				(await ModeratorEmbed(data.moderator)).setColor(colors.delete),
			],
		}
	},
	[LogType.UPDATE_MODERATOR]: async (data, moderator) => {
		return {
			content: `**${moderator.name}** updated ${data.moderator.name} (${data.moderator.id})`,
			embeds: [
				(await ModeratorEmbed(data.moderator)).setColor(colors.modify),
			],
		}
	},
	[LogType.LINK_MODERATOR_ACCOUNT]: async (data, moderator) => {
		return {
			content: `**${moderator.name}** linked a moderator account to **${data.moderator.name}** (${data.moderator.id})`,
			embeds: [
				(await ModeratorAccountEmbed(data.account)).setColor(colors.create),
			],
		}
	},
	[LogType.UNLINK_MODERATOR_ACCOUNT]: async (data, moderator) => {
		return {
			content: `**${moderator.name}** unlinked a moderator account from **${data.moderator.name}** (${data.moderator.id})`,
			embeds: [
				(await ModeratorAccountEmbed(data.account)).setColor(colors.delete),
			],
		}
	},
	[LogType.ACCEPT_REPORT]: async (data, moderator) => {
		return {
			content: `**${moderator.name}** accepted a report on **${data.target.name}** (${data.target.id}) from **${data.from.name}** (${data.from.id})`,
			embeds: [
				(await ReportEmbed(data.report)).setColor(colors.accept),
				(await ActionEmbed(data.action)).setColor(colors.accept),
			],
		}
	},
	[LogType.DECLINE_REPORT]: async (data, moderator) => {
		return {
			content: `**${moderator.name}** declined a report on **${data.target.name}** (${data.target.id}) from **${data.from.name}** (${data.from.id})`,
			embeds: [
				(await ReportEmbed(data.report)).setColor(colors.decline),
			],
		}
	},
} as { [T in LogType]: LogMessageGenerator<T> }

// TODO: Remove this once Log<T> exists
function getMessage<T extends LogType>(type: T, data: LogTypeData[T], moderator: Moderator): Promise<MessageCreateOptions> {
	return messages[type](data, moderator)
}

export default {
	channel: "logs",
	events: {
		async log(data: LogData) {
			const log = new Log(data)

			const [ resolvedData, resolvedModerator ] = await Promise.all([
				log.resolveData(API),
				log.moderator.resolve(API),
			])

			return getMessage(log.type, resolvedData, resolvedModerator)
		},
	},
} as LoggerCategory