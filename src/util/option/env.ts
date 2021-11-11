type Environment = {
	configFile?: string,
	discordToken: string,
	discordClientId: string,
	discordClientSecret: string,
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
	discordToken: getEnvironmentVariable("DISCORD_TOKEN", true),
	discordClientId: getEnvironmentVariable("DISCORD_CLIENT_ID", true),
	discordClientSecret: getEnvironmentVariable("DISCORD_CLIENT_SECRET", true),
	apiUrl: getEnvironmentVariable("API_URL", true),
	apiToken: getEnvironmentVariable("API_TOKEN", true),
	redisUrl: getEnvironmentVariable("REDIS_URL", true),
} as Environment

export default env