import { Snowflake } from "discord-api-types"

type Environment = {
	configFile?: string,
	token: string,
	clientId: string,
	clientSecret: string,
	guildId: Snowflake,
	apiUrl: string,
	apiToken: string,
	redisUrl: string,
}

function getEnvironmentVariable(name: string, required: true): string | never
function getEnvironmentVariable(name: string, required?: false): string | undefined
function getEnvironmentVariable(name: string, required?: boolean): string | undefined | never {
	const value = process.env[name]
	if (required && !value) throw new Error(`Environment variable "${name}" is required`)
	return value
}

const env = {
	configFile: getEnvironmentVariable("CONFIG_FILE", false),
	token: getEnvironmentVariable("TOKEN", true),
	clientId: getEnvironmentVariable("CLIENT_ID", true),
	clientSecret: getEnvironmentVariable("CLIENT_SECRET", true),
	guildId: getEnvironmentVariable("GUILD_ID", true),
	apiUrl: getEnvironmentVariable("API_URL", true),
	apiToken: getEnvironmentVariable("API_TOKEN", true),
	redisUrl: getEnvironmentVariable("REDIS_URL", true),
} as Environment

export default env