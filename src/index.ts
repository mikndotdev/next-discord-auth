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
	clientId: string;
	clientSecret: string;
	scopes: string[];
	redirectUri: string;
	jwtSecret: string;
}

let globalConfig: Config | null = null;

export function setup(config: Config) {
	globalConfig = config;
}

export function getGlobalConfig(): Config {
	if (!globalConfig) {
		throw new Error("Global config has not been set.");
	}
	return globalConfig;
}
