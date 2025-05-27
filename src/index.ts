export interface Session {
	user: {
		id: string;
		name: string;
		email?: string;
		avatar: string;
	};
	expires: string;
	accessToken?: string;
}

export interface Config {
	clientId?: string;
	clientSecret?: string;
	scopes?: string[];
	redirectUri: string;
	jwtSecret: string;
}

let globalConfig: Config | null = null;

export function setup(config: Config) {
	if (!config || !config.redirectUri || !config.jwtSecret) {
		throw new Error(
			"Invalid configuration. 'redirectUri' and 'jwtSecret' are required.",
		);
	}
	if (!config.clientId || !config.clientSecret) {
		if (!process.env.AUTH_DISCORD_ID || !process.env.AUTH_DISCORD_SECRET) {
			throw new Error(
				"You must provide 'clientId' and 'clientSecret' in the config or set them as environment variables AUTH_DISCORD_ID and AUTH_DISCORD_SECRET.",
			);
		}
	}
	if (globalConfig) {
		console.warn("Global config is already set. Overwriting existing config.");
	}
	globalConfig = {
		clientId: config.clientId || process.env.AUTH_DISCORD_ID,
		clientSecret:
			config.clientSecret || process.env.AUTH_DISCORD_SECRET,
		scopes: config.scopes || ["identify", "email"],
		redirectUri: config.redirectUri,
		jwtSecret: config.jwtSecret,
	};
}

export function getGlobalConfig(): Config {
	if (!globalConfig) {
		throw new Error("Global config has not been set.");
	}
	return globalConfig;
}
